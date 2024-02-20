import * as zod from 'zod';
import EventEmitter from 'eventemitter3';
import bigInt from 'big-integer';
import transform from 'lodash.transform';

import {EventSchema} from './schema/events';
import {Platform} from './Constants';
import getDefaultSdkConfiguration from './utils/getDefaultSdkConfiguration';
import {IDiscordSDK, MaybeZodObject} from './interface';
import {ChannelTypesObject} from './schema/common';

export class DiscordSDKMock implements IDiscordSDK {
  readonly clientId: string;
  readonly platform = Platform.DESKTOP;
  readonly instanceId = '123456789012345678';
  readonly configuration = getDefaultSdkConfiguration();
  private frameId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  private eventBus = new EventEmitter();
  public commands: IDiscordSDK['commands'];
  readonly guildId: string | null;
  readonly channelId: string | null;

  constructor(clientId: string, guildId: string | null, channelId: string | null) {
    this.clientId = clientId;

    this.commands = this._updateCommandMocks({});
    this.guildId = guildId;
    this.channelId = channelId;
  }

  _updateCommandMocks(newCommands: Partial<IDiscordSDK['commands']>) {
    // Wrap all the command functions with logging
    this.commands = transform(Object.assign({}, commandsMockDefault, newCommands), (mock, func, name) => {
      mock[name as keyof IDiscordSDK['commands']] = async (...args: any[]) => {
        console.info(`DiscordSDKMock: ${String(name)}(${JSON.stringify(args)})`);
        return await (func as (...args: any[]) => any)(...args);
      };
    });
    // redundant return here to satisfy the constructor defining commands
    return this.commands;
  }

  emitReady() {
    this.emitEvent('READY', undefined);
  }

  close(...args: any[]) {
    console.info(`DiscordSDKMock: close(${JSON.stringify(args)})`);
  }

  ready() {
    return Promise.resolve();
  }

  async subscribe<K extends keyof typeof EventSchema>(
    event: K,
    listener: (event: zod.infer<(typeof EventSchema)[K]['payload']>['data']) => unknown,
    _subscribeArgs?: MaybeZodObject<(typeof EventSchema)[K]>
  ) {
    return await this.eventBus.on(event, listener);
  }

  async unsubscribe<K extends keyof typeof EventSchema>(
    event: K,
    listener: (event: zod.infer<(typeof EventSchema)[K]['payload']>['data']) => unknown
  ): Promise<unknown> {
    return await this.eventBus.off(event, listener);
  }

  emitEvent<T>(event: string, data: T) {
    this.eventBus.emit(event, data);
  }
}
/** Default return values for all discord SDK commands */
export const commandsMockDefault: IDiscordSDK['commands'] = {
  authorize: () => Promise.resolve({code: 'mock_code'}),
  authenticate: () =>
    Promise.resolve({
      access_token: 'mock_token',
      user: {
        username: 'mock_user_username',
        discriminator: 'mock_user_discriminator',
        id: 'mock_user_id',
        avatar: null,
        public_flags: 1,
      },
      scopes: [],
      expires: new Date(2121, 1, 1).toString(),
      application: {
        description: 'mock_app_description',
        icon: 'mock_app_icon',
        id: 'mock_app_id',
        name: 'mock_app_name',
      },
    }),
  setActivity: () =>
    Promise.resolve({
      name: 'mock_activity_name',
      type: 0,
    }),
  getChannel: () =>
    Promise.resolve({
      id: 'mock_channel_id',
      name: 'mock_channel_name',
      type: ChannelTypesObject.GUILD_TEXT,
      voice_states: [],
      messages: [],
    }),
  getSkus: () => Promise.resolve({skus: []}),
  getEntitlements: () => Promise.resolve({entitlements: []}),
  startPurchase: () => Promise.resolve([]),
  startPremiumPurchase: () => Promise.resolve(null),
  setConfig: () => Promise.resolve({use_interactive_pip: false}),
  getSelectedVoiceChannel: () => Promise.resolve(null),
  userSettingsGetLocale: () => Promise.resolve({locale: ''}),
  getVoiceSettings: () =>
    Promise.resolve({
      input: {
        device_id: 'default',
        volume: 0,
        available_devices: [{id: 'default', name: 'default'}],
      },
      output: {
        device_id: 'default',
        volume: 0,
        available_devices: [{id: 'default', name: 'default'}],
      },
      mode: {
        type: 'VOICE_ACTIVITY',
        auto_threshold: false,
        threshold: 0,
        shortcut: [],
        delay: 0,
      },
      automatic_gain_control: false,
      echo_cancellation: false,
      noise_suppression: false,
      qos: false,
      silence_warning: false,
      deaf: false,
      mute: false,
    }),
  setUserVoiceSettings: () =>
    Promise.resolve({
      user_id: 'user_id',
      mute: false,
      pan: {
        left: 1,
        right: 1,
      },
      volume: 100,
    }),
  openExternalLink: () => Promise.resolve(null),
  encourageHardwareAcceleration: () => Promise.resolve({enabled: true}),
  captureLog: () => Promise.resolve(null),
  setOrientationLockState: () => Promise.resolve(null),
  openInviteDialog: () => Promise.resolve(null),
  getPlatformBehaviors: () =>
    Promise.resolve({
      iosKeyboardResizesView: true,
    }),
  getChannelPermissions: () => Promise.resolve({permissions: bigInt(1234567890) as unknown as bigint}),
  openShareMomentDialog: () => Promise.resolve(null),
  initiateImageUpload: () =>
    Promise.resolve({
      image_url:
        'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0b52aa9e99b832574a53_full_logo_blurple_RGB.png',
    }),
  getInstanceConnectedParticipants: () => Promise.resolve({participants: []}),
};
