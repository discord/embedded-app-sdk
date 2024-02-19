import * as zod from 'zod';
import {Orientation} from '../Constants';
import {DISPATCH} from './common';
import {zodCoerceUnhandledValue} from '../utils/zodUtils';
import {
  ChannelTypesObject,
  Entitlement,
  Guild,
  Message,
  OrientationTypeObject,
  LayoutModeTypeObject,
  ReceiveFramePayload as ReceiveFrame,
  ShortcutKey,
  ThermalState,
  User,
  VoiceState,
  Commands,
} from './common';
import {VoiceSettingsResponse} from './responses';
import {GetActivityInstanceConnectedParticipantsResponseSchema} from '../generated/schemas';

// ERROR is sent as evt but is a special case, so is excluded from Events enum
export const ERROR = 'ERROR';
export enum Events {
  READY = 'READY',
  GUILD_STATUS = 'GUILD_STATUS',
  GUILD_CREATE = 'GUILD_CREATE',
  CHANNEL_CREATE = 'CHANNEL_CREATE',
  VOICE_CHANNEL_SELECT = 'VOICE_CHANNEL_SELECT',
  VOICE_SETTINGS_UPDATE = 'VOICE_SETTINGS_UPDATE',
  VOICE_STATE_CREATE = 'VOICE_STATE_CREATE',
  VOICE_STATE_UPDATE = 'VOICE_STATE_UPDATE',
  VOICE_STATE_DELETE = 'VOICE_STATE_DELETE',
  VOICE_CONNECTION_STATUS = 'VOICE_CONNECTION_STATUS',
  MESSAGE_CREATE = 'MESSAGE_CREATE',
  MESSAGE_UPDATE = 'MESSAGE_UPDATE',
  MESSAGE_DELETE = 'MESSAGE_DELETE',
  SPEAKING_START = 'SPEAKING_START',
  SPEAKING_STOP = 'SPEAKING_STOP',
  NOTIFICATION_CREATE = 'NOTIFICATION_CREATE',
  CAPTURE_SHORTCUT_CHANGE = 'CAPTURE_SHORTCUT_CHANGE',
  ACTIVITY_JOIN = 'ACTIVITY_JOIN',
  ACTIVITY_JOIN_REQUEST = 'ACTIVITY_JOIN_REQUEST',
  ACTIVITY_PIP_MODE_UPDATE = 'ACTIVITY_PIP_MODE_UPDATE',
  ACTIVITY_LAYOUT_MODE_UPDATE = 'ACTIVITY_LAYOUT_MODE_UPDATE',
  ORIENTATION_UPDATE = 'ORIENTATION_UPDATE',
  CURRENT_USER_UPDATE = 'CURRENT_USER_UPDATE',
  ENTITLEMENT_CREATE = 'ENTITLEMENT_CREATE',
  THERMAL_STATE_UPDATE = 'THERMAL_STATE_UPDATE',
  ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE = 'ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE',
}

export const DispatchEventFrame = ReceiveFrame.extend({
  evt: zod.nativeEnum(Events),
  nonce: zod.string().nullable(),
  cmd: zod.literal(DISPATCH),
  data: zod.object({}).passthrough(),
});

export interface EventArgs<Z extends zod.AnyZodObject = zod.AnyZodObject> {
  parser: Z;
  // BAD CODE ALERT - this arg will not be used for any runtime validation
  // It's only used to enforce typescript. But it's easier to keep both as zod
  subscribeArgs?: Z;
}

export const EventSchema = {
  [Events.READY]: {
    parser: DispatchEventFrame.extend({
      evt: zod.literal(Events.READY),
      data: zod.object({}),
    }),
  },
  [Events.GUILD_STATUS]: {
    parser: DispatchEventFrame.extend({
      evt: zod.literal(Events.GUILD_STATUS),
      data: zod.object({}),
    }),
  },
  [Events.GUILD_CREATE]: {
    parser: DispatchEventFrame.extend({
      evt: zod.literal(Events.GUILD_CREATE),
      data: zod.object({}),
    }),
  },
  [Events.CHANNEL_CREATE]: {
    parser: DispatchEventFrame.extend({
      evt: zod.literal(Events.CHANNEL_CREATE),
      data: zod.object({}),
    }),
  },
  [Events.VOICE_CHANNEL_SELECT]: {
    parser: DispatchEventFrame.extend({
      evt: zod.literal(Events.VOICE_CHANNEL_SELECT),
      data: zod.object({}),
    }),
  },
  [Events.VOICE_SETTINGS_UPDATE]: {
    parser: DispatchEventFrame.extend({
      evt: zod.literal(Events.VOICE_SETTINGS_UPDATE),
      data: zod.object({}),
    }),
  },
  [Events.VOICE_STATE_CREATE]: {
    parser: DispatchEventFrame.extend({
      evt: zod.literal(Events.VOICE_STATE_CREATE),
      data: zod.object({}),
    }),
  },
  [Events.VOICE_STATE_UPDATE]: {
    parser: DispatchEventFrame.extend({
      evt: zod.literal(Events.VOICE_STATE_UPDATE),
      data: zod.object({
        channel_id: zod.string(),
      }),
    }),
    subscribeArgs: zod.object({
      channel_id: zod.string(),
    }),
  },
  [Events.VOICE_STATE_DELETE]: {
    parser: DispatchEventFrame.extend({
      evt: zod.literal(Events.VOICE_STATE_DELETE),
      data: zod.object({}),
    }),
  },
  [Events.VOICE_CONNECTION_STATUS]: {
    parser: DispatchEventFrame.extend({
      evt: zod.literal(Events.VOICE_CONNECTION_STATUS),
      data: zod.object({}),
    }),
  },
  [Events.MESSAGE_CREATE]: {
    parser: DispatchEventFrame.extend({
      evt: zod.literal(Events.MESSAGE_CREATE),
      data: zod.object({}),
    }),
  },
  [Events.MESSAGE_UPDATE]: {
    parser: DispatchEventFrame.extend({
      evt: zod.literal(Events.MESSAGE_UPDATE),
      data: zod.object({}),
    }),
  },
  [Events.MESSAGE_DELETE]: {
    parser: DispatchEventFrame.extend({
      evt: zod.literal(Events.MESSAGE_DELETE),
      data: zod.object({}),
    }),
  },
  [Events.SPEAKING_START]: {
    parser: DispatchEventFrame.extend({
      evt: zod.literal(Events.SPEAKING_START),
      data: zod.object({}),
    }),
  },
  [Events.SPEAKING_STOP]: {
    parser: DispatchEventFrame.extend({
      evt: zod.literal(Events.SPEAKING_STOP),
      data: zod.object({}),
    }),
  },
  [Events.NOTIFICATION_CREATE]: {
    parser: DispatchEventFrame.extend({
      evt: zod.literal(Events.NOTIFICATION_CREATE),
      data: zod.object({}),
    }),
  },
  [Events.CAPTURE_SHORTCUT_CHANGE]: {
    parser: DispatchEventFrame.extend({
      evt: zod.literal(Events.CAPTURE_SHORTCUT_CHANGE),
      data: zod.object({}),
    }),
  },
  [Events.ACTIVITY_JOIN]: {
    parser: DispatchEventFrame.extend({
      evt: zod.literal(Events.ACTIVITY_JOIN),
      data: zod.object({}),
    }),
  },
  [Events.ACTIVITY_JOIN_REQUEST]: {
    parser: DispatchEventFrame.extend({
      evt: zod.literal(Events.ACTIVITY_JOIN_REQUEST),
      data: zod.object({}),
    }),
  },
  [Events.ACTIVITY_PIP_MODE_UPDATE]: {
    parser: DispatchEventFrame.extend({
      evt: zod.literal(Events.ACTIVITY_PIP_MODE_UPDATE),
      data: zod.object({}),
    }),
  },
  [Events.ACTIVITY_LAYOUT_MODE_UPDATE]: {
    parser: DispatchEventFrame.extend({
      evt: zod.literal(Events.ACTIVITY_LAYOUT_MODE_UPDATE),
      data: zod.object({}),
    }),
  },
  [Events.ORIENTATION_UPDATE]: {
    parser: DispatchEventFrame.extend({
      screen_orientation: zodCoerceUnhandledValue(OrientationTypeObject),
      /**
       * @deprecated use screen_orientation instead
       */
      orientation: zod.nativeEnum(Orientation),
    }),
  },
  [Events.CURRENT_USER_UPDATE]: {
    parser: DispatchEventFrame.extend({
      evt: zod.literal(Events.CURRENT_USER_UPDATE),
      data: zod.object({}),
    }),
  },
  [Events.ENTITLEMENT_CREATE]: {
    parser: DispatchEventFrame.extend({
      evt: zod.literal(Events.ENTITLEMENT_CREATE),
      data: zod.object({}),
    }),
  },
  [Events.THERMAL_STATE_UPDATE]: {
    parser: DispatchEventFrame.extend({
      evt: zod.literal(Events.THERMAL_STATE_UPDATE),
      data: zod.object({thermal_state: ThermalState}),
    }),
  },
  [Events.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE]: {
    parser: DispatchEventFrame.extend({
      evt: zod.literal(Events.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE),
      data: zod.object({}),
    }),
  },
} satisfies Record<keyof typeof Events, EventArgs>;

export type GetEventListener<K extends keyof typeof EventSchema> = (
  event: zod.infer<(typeof EventSchema)[K]['parser']>['data']
) => unknown;

export const ErrorEvent = ReceiveFrame.extend({
  evt: zod.literal(ERROR),
  data: zod
    .object({
      code: zod.number(),
      message: zod.string().optional(),
    })
    .passthrough(),
  cmd: zod.nativeEnum(Commands),
  nonce: zod.string().nullable(),
});

export const OtherEvent = DispatchEventFrame.extend({
  evt: zod.string(),
});

export const EventFrame = zod.union([DispatchEventFrame, OtherEvent, ErrorEvent]);

function makeEvent<N extends string, T extends Record<string, zod.ZodType<any, any>>>(name: N, data: T) {
  return DispatchEventFrame.extend({
    evt: zod.literal(name),
    data: zod.object(data),
  });
}

export const Ready = makeEvent(Events.READY, {
  v: zod.number(),
  config: zod.object({
    cdn_host: zod.string().optional(),
    api_endpoint: zod.string(),
    environment: zod.string(),
  }),
  user: zod
    .object({
      id: zod.string(),
      username: zod.string(),
      discriminator: zod.string(),
      avatar: zod.string().optional(),
    })
    .optional(),
});

export const GuildStatus = makeEvent(Events.GUILD_STATUS, {
  guild: Guild,
  online: zod.number().optional(),
});

export const GuildCreate = makeEvent(Events.GUILD_CREATE, {
  id: zod.string(),
  name: zod.string(),
});

export const ChannelCreate = makeEvent(Events.CHANNEL_CREATE, {
  id: zod.string(),
  name: zod.string(),
  type: zodCoerceUnhandledValue(ChannelTypesObject),
});

export const VoiceChannelSelect = makeEvent(Events.VOICE_CHANNEL_SELECT, {
  channel_id: zod.string().nullable(),
  guild_id: zod.string().nullable().optional(),
});

export const VoiceSettingsUpdate = makeEvent(Events.VOICE_STATE_UPDATE, {
  data: VoiceSettingsResponse,
});

export const VoiceStateCreate = makeEvent(Events.VOICE_STATE_CREATE, {
  voice_state: VoiceState,
  user: User,
  nick: zod.string(),
  volume: zod.number(),
  mute: zod.boolean(),
  pan: zod.object({
    left: zod.number(),
    right: zod.number(),
  }),
});

export const VoiceStateUpdate = VoiceStateCreate.extend({
  evt: zod.literal(Events.VOICE_STATE_UPDATE),
});

export const VoiceStateDelete = VoiceStateCreate.extend({
  evt: zod.literal(Events.VOICE_STATE_DELETE),
});

export const VoiceConnectionStatusStateObject = {
  UNHANDLED: -1,
  DISCONNECTED: 'DISCONNECTED',
  AWAITING_ENDPOINT: 'AWAITING_ENDPOINT',
  AUTHENTICATING: 'AUTHENTICATING',
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  VOICE_DISCONNECTED: 'VOICE_DISCONNECTED',
  VOICE_CONNECTING: 'VOICE_CONNECTING',
  VOICE_CONNECTED: 'VOICE_CONNECTED',
  NO_ROUTE: 'NO_ROUTE',
  ICE_CHECKING: 'ICE_CHECKING',
} as const;
export const VoiceConnectionStatus = makeEvent(Events.VOICE_CONNECTION_STATUS, {
  state: zodCoerceUnhandledValue(VoiceConnectionStatusStateObject),
  hostname: zod.string(),
  pings: zod.array(zod.number()),
  average_ping: zod.number(),
  last_ping: zod.number(),
});

export const MessageCreate = makeEvent(Events.MESSAGE_CREATE, {
  channel_id: zod.string(),
  message: Message,
});

export const MessageUpdate = MessageCreate.extend({
  evt: zod.literal(Events.MESSAGE_UPDATE),
});

export const MessageDelete = MessageCreate.extend({
  evt: zod.literal(Events.MESSAGE_DELETE),
});

export const StartSpeaking = makeEvent(Events.SPEAKING_START, {
  user_id: zod.string(),
});

export const StopSpeaking = makeEvent(Events.SPEAKING_STOP, {
  user_id: zod.string(),
});

export const NotificationCreate = makeEvent(Events.NOTIFICATION_CREATE, {
  channel_id: zod.string(),
  message: Message,
  icon_url: zod.string(),
  title: zod.string(),
  body: zod.string(),
});

export const CaptureShortcutChange = makeEvent(Events.CAPTURE_SHORTCUT_CHANGE, {
  shortcut: ShortcutKey,
});

export const ActivityJoinIntentObject = {
  UNHANDLED: -1,
  PLAY: 0,
  SPECTATE: 1,
} as const;

export const ActivityJoin = makeEvent(Events.ACTIVITY_JOIN, {
  secret: zod.string(),
  intent: zodCoerceUnhandledValue(ActivityJoinIntentObject).optional(),
});

export const ActivityJoinRequest = makeEvent(Events.ACTIVITY_JOIN_REQUEST, {
  user: User,
});

export const ActivityPIPModeUpdate = makeEvent(Events.ACTIVITY_PIP_MODE_UPDATE, {
  is_pip_mode: zod.boolean(),
});

export const ActivityLayoutModeUpdate = makeEvent(Events.ACTIVITY_LAYOUT_MODE_UPDATE, {
  layout_mode: zodCoerceUnhandledValue(LayoutModeTypeObject),
});

export const OrientationUpdate = makeEvent(Events.ORIENTATION_UPDATE, {
  screen_orientation: zodCoerceUnhandledValue(OrientationTypeObject),

  /**
   * @deprecated use screen_orientation instead
   */
  orientation: zod.nativeEnum(Orientation),
});

// For some god forsaken reason the user shape for this event doesnt match our existing event shapes, and is directly dumped into the
// event
export const CurrentUserUpdate = makeEvent(Events.CURRENT_USER_UPDATE, {
  avatar: zod.string().optional().nullable(),
  bot: zod.boolean(),
  discriminator: zod.string(),
  flags: zod.number().optional().nullable(),
  id: zod.string(),
  premium_type: zod.number().optional().nullable(),
  username: zod.string(),
});

export const EntitlementCreate = makeEvent(Events.ENTITLEMENT_CREATE, {
  entitlement: Entitlement,
});

export const ThermalStateUpdate = makeEvent(Events.THERMAL_STATE_UPDATE, {
  thermal_state: ThermalState,
});

export const InstanceConnectedParticipantsUpdate = makeEvent(Events.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE, {
  participants: GetActivityInstanceConnectedParticipantsResponseSchema.shape.participants,
});

export function parseEventPayload<K extends keyof typeof EventSchema = keyof typeof EventSchema>(
  data: zod.infer<typeof EventFrame>
): zod.infer<(typeof EventSchema)[K]['parser']> {
  const event = data.evt;
  if (!(event in Events)) {
    throw new Error(`Unrecognized event type ${data.evt}`);
  }
  const eventSchema = EventSchema[event as Events];
  return eventSchema.parser.parse(data);
}
