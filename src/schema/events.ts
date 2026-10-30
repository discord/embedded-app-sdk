import * as zod from 'zod';
import {Commands, DISPATCH, ReceiveFramePayload as ReceiveFrame} from './common';
import {EventSchemas as GeneratedEventSchemas} from '../generated/schemas';

// ERROR is sent as evt but is a special case, so is excluded from Events enum
export const ERROR = 'ERROR';
export enum Events {
  READY = 'READY',
  // START-GENERATED-SECTION
  ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE = 'ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE',
  ACTIVITY_JOIN = 'ACTIVITY_JOIN',
  ACTIVITY_LAYOUT_MODE_UPDATE = 'ACTIVITY_LAYOUT_MODE_UPDATE',
  CURRENT_GUILD_MEMBER_UPDATE = 'CURRENT_GUILD_MEMBER_UPDATE',
  CURRENT_USER_UPDATE = 'CURRENT_USER_UPDATE',
  ENTITLEMENT_CREATE = 'ENTITLEMENT_CREATE',
  QUEST_ENROLLMENT_STATUS_UPDATE = 'QUEST_ENROLLMENT_STATUS_UPDATE',
  RELATIONSHIP_UPDATE = 'RELATIONSHIP_UPDATE',
  SPEAKING_START = 'SPEAKING_START',
  SPEAKING_STOP = 'SPEAKING_STOP',
  THERMAL_STATE_UPDATE = 'THERMAL_STATE_UPDATE',
  VOICE_STATE_UPDATE = 'VOICE_STATE_UPDATE',
  // END-GENERATED-SECTION
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
  // START-GENERATED-SECTION
  [Events.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE]: {
    payload: DispatchEventFrame.extend({
      evt: zod.literal(Events.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE),
      data: GeneratedEventSchemas.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE.payload,
    }),
  },
  [Events.ACTIVITY_JOIN]: {
    payload: DispatchEventFrame.extend({
      evt: zod.literal(Events.ACTIVITY_JOIN),
      data: GeneratedEventSchemas.ACTIVITY_JOIN.payload,
    }),
  },
  [Events.ACTIVITY_LAYOUT_MODE_UPDATE]: {
    payload: DispatchEventFrame.extend({
      evt: zod.literal(Events.ACTIVITY_LAYOUT_MODE_UPDATE),
      data: GeneratedEventSchemas.ACTIVITY_LAYOUT_MODE_UPDATE.payload,
    }),
  },
  [Events.CURRENT_GUILD_MEMBER_UPDATE]: {
    payload: DispatchEventFrame.extend({
      evt: zod.literal(Events.CURRENT_GUILD_MEMBER_UPDATE),
      data: GeneratedEventSchemas.CURRENT_GUILD_MEMBER_UPDATE.payload,
    }),
    subscribeArgs: GeneratedEventSchemas.CURRENT_GUILD_MEMBER_UPDATE.subscribeArgs,
  },
  [Events.CURRENT_USER_UPDATE]: {
    payload: DispatchEventFrame.extend({
      evt: zod.literal(Events.CURRENT_USER_UPDATE),
      data: GeneratedEventSchemas.CURRENT_USER_UPDATE.payload,
    }),
  },
  [Events.ENTITLEMENT_CREATE]: {
    payload: DispatchEventFrame.extend({
      evt: zod.literal(Events.ENTITLEMENT_CREATE),
      data: GeneratedEventSchemas.ENTITLEMENT_CREATE.payload,
    }),
  },
  [Events.QUEST_ENROLLMENT_STATUS_UPDATE]: {
    payload: DispatchEventFrame.extend({
      evt: zod.literal(Events.QUEST_ENROLLMENT_STATUS_UPDATE),
      data: GeneratedEventSchemas.QUEST_ENROLLMENT_STATUS_UPDATE.payload,
    }),
    subscribeArgs: GeneratedEventSchemas.QUEST_ENROLLMENT_STATUS_UPDATE.subscribeArgs,
  },
  [Events.RELATIONSHIP_UPDATE]: {
    payload: DispatchEventFrame.extend({
      evt: zod.literal(Events.RELATIONSHIP_UPDATE),
      data: GeneratedEventSchemas.RELATIONSHIP_UPDATE.payload,
    }),
  },
  [Events.SPEAKING_START]: {
    payload: DispatchEventFrame.extend({
      evt: zod.literal(Events.SPEAKING_START),
      data: GeneratedEventSchemas.SPEAKING_START.payload,
    }),
    subscribeArgs: GeneratedEventSchemas.SPEAKING_START.subscribeArgs,
  },
  [Events.SPEAKING_STOP]: {
    payload: DispatchEventFrame.extend({
      evt: zod.literal(Events.SPEAKING_STOP),
      data: GeneratedEventSchemas.SPEAKING_STOP.payload,
    }),
    subscribeArgs: GeneratedEventSchemas.SPEAKING_STOP.subscribeArgs,
  },
  [Events.THERMAL_STATE_UPDATE]: {
    payload: DispatchEventFrame.extend({
      evt: zod.literal(Events.THERMAL_STATE_UPDATE),
      data: GeneratedEventSchemas.THERMAL_STATE_UPDATE.payload,
    }),
  },
  [Events.VOICE_STATE_UPDATE]: {
    payload: DispatchEventFrame.extend({
      evt: zod.literal(Events.VOICE_STATE_UPDATE),
      data: GeneratedEventSchemas.VOICE_STATE_UPDATE.payload,
    }),
    subscribeArgs: GeneratedEventSchemas.VOICE_STATE_UPDATE.subscribeArgs,
  },
  // END-GENERATED-SECTION
} satisfies Record<keyof typeof Events, EventArgs>;
