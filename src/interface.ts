import {Platform, RPCCloseCodes} from './Constants';
import commands from './commands';
import {EventArgs, EventSchema} from './schema/events';
import * as zod from 'zod';

/**
 * An optional configuration object to customize the sdk options
 */
export interface SdkConfiguration {
  /**
   * By default, all console logging is overridden and forwarded to the host application.
   * Logs will still be sent to the web console as well.
   * Setting this flag to true will disable this functionality
   */
  readonly disableConsoleLogOverride: boolean;
}

export type MaybeZodObject<T extends EventArgs> = T['subscribeArgs'] extends NonNullable<EventArgs['subscribeArgs']>
  ? zod.infer<T['subscribeArgs']>
  : undefined;

export interface IDiscordSDK {
  readonly clientId: string;
  readonly instanceId: string;
  readonly platform: Platform;
  readonly commands: ReturnType<typeof commands>;
  readonly configuration: SdkConfiguration;
  readonly channelId: string | null;
  readonly guildId: string | null;

  close(code: RPCCloseCodes, message: string): void;
  subscribe<K extends keyof typeof EventSchema>(
    event: K,
    listener: (event: zod.infer<(typeof EventSchema)[K]['payload']>['data']) => unknown,
    subscribeArgs?: MaybeZodObject<(typeof EventSchema)[K]>
  ): Promise<unknown>;
  unsubscribe<K extends keyof typeof EventSchema>(
    event: K,
    listener: (event: zod.infer<(typeof EventSchema)[K]['payload']>['data']) => unknown
  ): Promise<unknown>;
  ready(): Promise<void>;
}

export interface LayoutModeEventListeners {
  layoutModeListener: EventListener;
  pipModeListener: EventListener;
}
