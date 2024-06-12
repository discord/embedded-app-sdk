import * as zod from 'zod';
import {Orientation} from '../Constants';
import {DISPATCH, GuildMemberRPC, UserVoiceState} from './common';
import {zodCoerceUnhandledValue} from '../utils/zodUtils';
import {
  Entitlement,
  OrientationTypeObject,
  LayoutModeTypeObject,
  ReceiveFramePayload as ReceiveFrame,
  ThermalState,
  User,
  Commands,
} from './common';
import {GetActivityInstanceConnectedParticipantsResponseSchema} from '../generated/schemas';

// ERROR is sent as evt but is a special case, so is excluded from Events enum
export const ERROR = 'ERROR';
export enum Events {
  READY = 'READY',
  VOICE_STATE_UPDATE = 'VOICE_STATE_UPDATE',
  SPEAKING_START = 'SPEAKING_START',
  SPEAKING_STOP = 'SPEAKING_STOP',
  ACTIVITY_LAYOUT_MODE_UPDATE = 'ACTIVITY_LAYOUT_MODE_UPDATE',
  ORIENTATION_UPDATE = 'ORIENTATION_UPDATE',
  CURRENT_USER_UPDATE = 'CURRENT_USER_UPDATE',
  CURRENT_GUILD_MEMBER_UPDATE = 'CURRENT_GUILD_MEMBER_UPDATE',
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
  payload: Z;
  // BAD CODE - this arg is being called at runtime, but it's only used to
  // enforce typescript. The perf hit is low and the DX with zod is worth it
  subscribeArgs?: Z;
}

export type EventPayloadData<K extends keyof typeof EventSchema> = zod.infer<
  (typeof EventSchema)[K]['payload']
>['data'];

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

export const ActivityJoinIntentObject = {
  UNHANDLED: -1,
  PLAY: 0,
  SPECTATE: 1,
} as const;

export function parseEventPayload<K extends keyof typeof EventSchema = keyof typeof EventSchema>(
  data: zod.infer<typeof EventFrame>,
): zod.infer<(typeof EventSchema)[K]['payload']> {
  const event = data.evt;
  if (!(event in Events)) {
    throw new Error(`Unrecognized event type ${data.evt}`);
  }
  const eventSchema = EventSchema[event as Events];
  return eventSchema.payload.parse(data);
}

export const EventSchema = {
  /**
   * @description
   * The READY event is emitted by Discord's RPC server in reply to a client
   * initiating the RPC handshake. The event includes information about
   * - the rpc server version
   * - the discord client configuration
   * - the (basic) user object
   *
   * Unlike other events, READY will only be omitted once, immediately after the
   * Embedded App SDK is initialized
   *
   * # Supported Platforms
   * | Web | iOS | Android |
   * |-----|-----|---------|
   * | ✅  | ✅  | ✅      |
   *
   * Required scopes: []
   *
   */
  [Events.READY]: {
    payload: DispatchEventFrame.extend({
      evt: zod.literal(Events.READY),
      data: zod.object({
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
      }),
    }),
  },
  [Events.VOICE_STATE_UPDATE]: {
    payload: DispatchEventFrame.extend({
      evt: zod.literal(Events.VOICE_STATE_UPDATE),
      data: UserVoiceState,
    }),
    subscribeArgs: zod.object({
      channel_id: zod.string(),
    }),
  },
  [Events.SPEAKING_START]: {
    payload: DispatchEventFrame.extend({
      evt: zod.literal(Events.SPEAKING_START),
      data: zod.object({
        lobby_id: zod.string().optional(),
        channel_id: zod.string().optional(),
        user_id: zod.string(),
      }),
    }),
    subscribeArgs: zod.object({
      lobby_id: zod.string().nullable().optional(),
      channel_id: zod.string().nullable().optional(),
    }),
  },
  [Events.SPEAKING_STOP]: {
    payload: DispatchEventFrame.extend({
      evt: zod.literal(Events.SPEAKING_STOP),
      data: zod.object({
        lobby_id: zod.string().optional(),
        channel_id: zod.string().optional(),
        user_id: zod.string(),
      }),
    }),
    subscribeArgs: zod.object({
      lobby_id: zod.string().nullable().optional(),
      channel_id: zod.string().nullable().optional(),
    }),
  },
  [Events.ACTIVITY_LAYOUT_MODE_UPDATE]: {
    payload: DispatchEventFrame.extend({
      evt: zod.literal(Events.ACTIVITY_LAYOUT_MODE_UPDATE),
      data: zod.object({
        layout_mode: zodCoerceUnhandledValue(LayoutModeTypeObject),
      }),
    }),
  },
  [Events.ORIENTATION_UPDATE]: {
    payload: DispatchEventFrame.extend({
      evt: zod.literal(Events.ORIENTATION_UPDATE),
      data: zod.object({
        screen_orientation: zodCoerceUnhandledValue(OrientationTypeObject),
        /**
         * @deprecated use screen_orientation instead
         */
        orientation: zod.nativeEnum(Orientation),
      }),
    }),
  },
  [Events.CURRENT_USER_UPDATE]: {
    payload: DispatchEventFrame.extend({
      evt: zod.literal(Events.CURRENT_USER_UPDATE),
      data: User,
    }),
  },
  [Events.CURRENT_GUILD_MEMBER_UPDATE]: {
    payload: DispatchEventFrame.extend({
      evt: zod.literal(Events.CURRENT_GUILD_MEMBER_UPDATE),
      data: GuildMemberRPC,
    }),
    subscribeArgs: zod.object({
      guild_id: zod.string(),
    }),
  },
  [Events.ENTITLEMENT_CREATE]: {
    payload: DispatchEventFrame.extend({
      evt: zod.literal(Events.ENTITLEMENT_CREATE),
      data: zod.object({entitlement: Entitlement}),
    }),
  },
  [Events.THERMAL_STATE_UPDATE]: {
    payload: DispatchEventFrame.extend({
      evt: zod.literal(Events.THERMAL_STATE_UPDATE),
      data: zod.object({thermal_state: ThermalState}),
    }),
  },
  [Events.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE]: {
    payload: DispatchEventFrame.extend({
      evt: zod.literal(Events.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE),
      data: zod.object({
        participants: GetActivityInstanceConnectedParticipantsResponseSchema.shape.participants,
      }),
    }),
  },
} satisfies Record<keyof typeof Events, EventArgs>;
