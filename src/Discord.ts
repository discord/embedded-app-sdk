import EventEmitter from 'eventemitter3';

import * as zod from 'zod';
import {ClosePayload, IncomingPayload, parseIncomingPayload} from './schema';
import commands, {Commands} from './commands';
import {v4 as uuidv4} from 'uuid';
import {SDKError} from './error';
import {EventSchema, ERROR, Events as RPCEvents} from './schema/events';
import {
  Platform,
  RPCCloseCodes,
  HANDSHAKE_SDK_VERSION_MINIMUM_MOBILE_VERSION,
  UNKNOWN_VERSION_NUMBER,
} from './Constants';
import getDefaultSdkConfiguration from './utils/getDefaultSdkConfiguration';
import {ConsoleLevel, consoleLevels, wrapConsoleMethod} from './utils/console';
import type {TSendCommand, TSendCommandPayload} from './schema/types';
import {IDiscordSDK, MaybeZodObjectArray, SdkConfiguration} from './interface';
import {version as sdkVersion} from '../package.json';

export enum Opcodes {
  HANDSHAKE = 0,
  FRAME = 1,
  CLOSE = 2,
  HELLO = 3,
}

const ALLOWED_ORIGINS = new Set(getAllowedOrigins());

function getAllowedOrigins(): string[] {
  if (typeof window === 'undefined') return [];

  return [
    window.location.origin,
    'https://discord.com',
    'https://discordapp.com',
    'https://ptb.discord.com',
    'https://ptb.discordapp.com',
    'https://canary.discord.com',
    'https://canary.discordapp.com',
    'https://staging.discord.co',
    'http://localhost:3333',
    'https://pax.discord.com',
    'null',
  ];
}

/**
 * The embedded application is running in an IFrame either within the main Discord client window or in a popout. The RPC server is always running in the main Discord client window. In either case, the referrer is the correct origin.
 */
function getRPCServerSource(): [Window, string] {
  return [window.parent.opener ?? window.parent, !!document.referrer ? document.referrer : '*'];
}

interface HandshakePayload {
  v: number;
  encoding: string;
  client_id: string;
  frame_id: string;
  sdk_version?: string;
}

export class DiscordSDK implements IDiscordSDK {
  readonly clientId: string;
  readonly instanceId: string;
  readonly customId: string | null;
  readonly referrerId: string | null;
  readonly platform: Platform;
  readonly guildId: string | null;
  readonly channelId: string | null;
  readonly locationId: string | null;
  readonly sdkVersion: string = sdkVersion;
  readonly mobileAppVersion: string | null = null;
  readonly configuration: SdkConfiguration;
  readonly source: Window | WindowProxy | null = null;
  readonly sourceOrigin: string = '';

  private frameId: string;
  private eventBus = new EventEmitter();
  private isReady: boolean;
  private pendingCommands: Map<
    string,
    {
      resolve: (response: unknown) => unknown;
      reject: (error: unknown) => unknown;
    }
  > = new Map();

  private getTransfer(payload: TSendCommandPayload): Transferable[] | undefined {
    switch (payload.cmd) {
      case Commands.SUBSCRIBE:
      case Commands.UNSUBSCRIBE:
        return undefined;
      default:
        return payload.transfer ?? undefined;
    }
  }

  private sendCommand: TSendCommand = (payload: TSendCommandPayload) => {
    if (this.source == null) throw new Error('Attempting to send message before initialization');
    const nonce = uuidv4();
    this.source?.postMessage([Opcodes.FRAME, {...payload, nonce}], this.sourceOrigin, this.getTransfer(payload));

    const promise = new Promise((resolve, reject) => {
      this.pendingCommands.set(nonce, {resolve, reject});
    });
    return promise;
  };

  commands = commands(this.sendCommand);

  constructor(clientId: string, configuration?: SdkConfiguration) {
    this.isReady = false;
    this.clientId = clientId;
    this.configuration = configuration ?? getDefaultSdkConfiguration();

    if (typeof window !== 'undefined') {
      window.addEventListener('message', this.handleMessage);
    }

    if (typeof window === 'undefined') {
      this.frameId = '';
      this.instanceId = '';
      this.customId = null;
      this.referrerId = null;
      this.platform = Platform.DESKTOP;
      this.guildId = null;
      this.channelId = null;
      this.locationId = null;
      return;
    }

    // START Capture URL Query Params
    const urlParams = new URLSearchParams(this._getSearch());

    const frameId = urlParams.get('frame_id');
    if (!frameId) {
      throw new Error('frame_id query param is not defined');
    }
    this.frameId = frameId;

    const instanceId = urlParams.get('instance_id');
    if (!instanceId) {
      throw new Error('instance_id query param is not defined');
    }
    this.instanceId = instanceId;

    const platform = urlParams.get('platform') as Platform;
    if (!platform) {
      throw new Error('platform query param is not defined');
    } else if (platform !== Platform.DESKTOP && platform !== Platform.MOBILE) {
      throw new Error(
        `Invalid query param "platform" of "${platform}". Valid values are "${Platform.DESKTOP}" or "${Platform.MOBILE}"`,
      );
    }
    this.platform = platform;

    this.customId = urlParams.get('custom_id');
    this.referrerId = urlParams.get('referrer_id');
    this.guildId = urlParams.get('guild_id');
    this.channelId = urlParams.get('channel_id');
    this.locationId = urlParams.get('location_id');

    this.mobileAppVersion = urlParams.get('mobile_app_version');
    // END Capture URL Query Params

    [this.source, this.sourceOrigin] = getRPCServerSource();
    this.addOnReadyListener();
    this.handshake();
  }
  close(code: RPCCloseCodes, message: string) {
    window.removeEventListener('message', this.handleMessage);

    const nonce = uuidv4();
    this.source?.postMessage([Opcodes.CLOSE, {code, message, nonce}], this.sourceOrigin);
  }

  async subscribe<K extends keyof typeof EventSchema>(
    event: K,
    listener: (event: zod.infer<(typeof EventSchema)[K]['payload']>['data']) => unknown,
    ...rest: MaybeZodObjectArray<(typeof EventSchema)[K]>
  ) {
    const [subscribeArgs] = rest;

    const listenerCount = this.eventBus.listenerCount(event);
    const emitter = this.eventBus.on(event, listener);

    // If first subscription, subscribe via RPC
    if (Object.values(RPCEvents).includes(event as RPCEvents) && event !== RPCEvents.READY && listenerCount === 0) {
      await this.sendCommand({
        cmd: Commands.SUBSCRIBE,
        args: subscribeArgs,
        evt: event,
      });
    }
    return emitter;
  }

  async unsubscribe<K extends keyof typeof EventSchema>(
    event: K,
    listener: (event: zod.infer<(typeof EventSchema)[K]['payload']>['data']) => unknown,
    ...rest: MaybeZodObjectArray<(typeof EventSchema)[K]>
  ) {
    const [unsubscribeArgs] = rest;
    if (event !== RPCEvents.READY && this.eventBus.listenerCount(event) === 1) {
      await this.sendCommand({
        cmd: Commands.UNSUBSCRIBE,
        evt: event,
        args: unsubscribeArgs,
      });
    }
    return this.eventBus.off(event, listener);
  }

  async ready() {
    if (this.isReady) {
      return;
    } else {
      await new Promise<void>((resolve) => {
        this.eventBus.once(RPCEvents.READY, resolve);
      });
    }
  }

  private parseMajorMobileVersion(): number {
    if (this.mobileAppVersion && this.mobileAppVersion.includes('.')) {
      try {
        return parseInt(this.mobileAppVersion.split('.')[0]);
      } catch {
        return UNKNOWN_VERSION_NUMBER;
      }
    }
    return UNKNOWN_VERSION_NUMBER;
  }

  private handshake() {
    const handshakePayload: HandshakePayload = {
      v: 1,
      encoding: 'json',
      client_id: this.clientId,
      frame_id: this.frameId,
    };
    const majorMobileVersion = this.parseMajorMobileVersion();
    if (this.platform === Platform.DESKTOP || majorMobileVersion >= HANDSHAKE_SDK_VERSION_MINIMUM_MOBILE_VERSION) {
      handshakePayload['sdk_version'] = this.sdkVersion;
    }
    this.source?.postMessage([Opcodes.HANDSHAKE, handshakePayload], this.sourceOrigin);
  }

  private addOnReadyListener() {
    this.eventBus.once(RPCEvents.READY, () => {
      this.overrideConsoleLogging();
      this.isReady = true;
    });
  }

  private overrideConsoleLogging() {
    if (this.configuration.disableConsoleLogOverride) return;

    const sendCaptureLogCommand = (level: ConsoleLevel, message: string) => {
      this.commands.captureLog({
        level,
        message,
      });
    };
    consoleLevels.forEach((level) => {
      wrapConsoleMethod(console, level, sendCaptureLogCommand);
    });
  }

  /**
   * WARNING - All "console" logs are emitted as messages to the Discord client
   *  If you write "console.log" anywhere in handleMessage or subsequent message handling
   * there is a good chance you will cause an infinite loop where you receive a message
   * which causes "console.log" which sends a message, which causes the discord client to
   * send a reply which causes handleMessage to fire again, and again to inifinity
   *
   * If you need to log within handleMessage, consider setting
   * config.disableConsoleLogOverride to true when initializing the SDK
   */
  private handleMessage = (event: MessageEvent) => {
    if (!ALLOWED_ORIGINS.has(event.origin)) return;

    const tuple = event.data;
    if (!Array.isArray(tuple)) {
      return;
    }
    const [opcode, data] = tuple;

    switch (opcode) {
      case Opcodes.HELLO:
        // backwards compat; the Discord client will still send HELLOs for old applications.
        //
        // TODO: figure out compatibility approach; it would be easier to maintain compatibility at the SDK level, not the underlying RPC protocol level...
        return;
      case Opcodes.CLOSE:
        return this.handleClose(data);
      case Opcodes.HANDSHAKE:
        return this.handleHandshake();
      case Opcodes.FRAME:
        return this.handleFrame(data);
      default:
        throw new Error('Invalid message format');
    }
  };

  private handleClose(data: unknown) {
    ClosePayload.parse(data);
  }

  private handleHandshake() {}

  private handleFrame(payload: zod.infer<typeof IncomingPayload>) {
    let parsed;
    try {
      parsed = parseIncomingPayload(payload);
    } catch (e) {
      console.error('Failed to parse', payload);
      console.error(e);
      return;
    }

    if (parsed.cmd === 'DISPATCH') {
      this.eventBus.emit(parsed.evt, parsed.data);
    } else {
      if (parsed.evt === ERROR) {
        // In response to a command
        if (parsed.nonce != null) {
          this.pendingCommands.get(parsed.nonce)?.reject(parsed.data);
          this.pendingCommands.delete(parsed.nonce);
          return;
        }
        // General error
        this.eventBus.emit('error', new SDKError(parsed.data.code, parsed.data.message));
      }

      if (parsed.nonce == null) {
        console.error('Missing nonce', payload);
        return;
      }
      this.pendingCommands.get(parsed.nonce)?.resolve(parsed);
      this.pendingCommands.delete(parsed.nonce);
    }
  }
  _getSearch() {
    return typeof window === 'undefined' ? '' : window.location.search;
  }
}
