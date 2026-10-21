import * as zod from 'zod';
import {zodCoerceUnhandledValue} from '../utils/zodUtils';
import {GetRelationshipsResponseSchema} from '../generated/schemas';

// DISPATCH is sent as cmd but is a special case, so is excluded from Commands enum
export const DISPATCH = 'DISPATCH';
export enum Commands {
  SUBSCRIBE = 'SUBSCRIBE',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
  // START-GENERATED-SECTION
  AUTHENTICATE = 'AUTHENTICATE',
  AUTHORIZE = 'AUTHORIZE',
  CAPTURE_LOG = 'CAPTURE_LOG',
  ENCOURAGE_HW_ACCELERATION = 'ENCOURAGE_HW_ACCELERATION',
  GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS = 'GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS',
  GET_CHANNEL = 'GET_CHANNEL',
  GET_CHANNELS = 'GET_CHANNELS',
  GET_CHANNEL_PERMISSIONS = 'GET_CHANNEL_PERMISSIONS',
  GET_CONTEXT = 'GET_CONTEXT',
  GET_CURRENT_USER = 'GET_CURRENT_USER',
  GET_ENTITLEMENTS_EMBEDDED = 'GET_ENTITLEMENTS_EMBEDDED',
  GET_GUILD = 'GET_GUILD',
  GET_PLATFORM_BEHAVIORS = 'GET_PLATFORM_BEHAVIORS',
  GET_QUEST = 'GET_QUEST',
  GET_QUEST_ENROLLMENT_STATUS = 'GET_QUEST_ENROLLMENT_STATUS',
  GET_RELATIONSHIPS = 'GET_RELATIONSHIPS',
  GET_ROLES = 'GET_ROLES',
  GET_SKUS_EMBEDDED = 'GET_SKUS_EMBEDDED',
  GET_USER = 'GET_USER',
  INITIATE_IMAGE_UPLOAD = 'INITIATE_IMAGE_UPLOAD',
  INVITE_USER_EMBEDDED = 'INVITE_USER_EMBEDDED',
  OPEN_EXTERNAL_LINK = 'OPEN_EXTERNAL_LINK',
  OPEN_INVITE_DIALOG = 'OPEN_INVITE_DIALOG',
  OPEN_SHARE_MOMENT_DIALOG = 'OPEN_SHARE_MOMENT_DIALOG',
  QUEST_START_TIMER = 'QUEST_START_TIMER',
  REQUEST_PROXY_TICKET_REFRESH = 'REQUEST_PROXY_TICKET_REFRESH',
  SET_ACTIVITY = 'SET_ACTIVITY',
  SET_CONFIG = 'SET_CONFIG',
  SET_ORIENTATION_LOCK_STATE = 'SET_ORIENTATION_LOCK_STATE',
  SHARE_LINK = 'SHARE_LINK',
  START_PURCHASE = 'START_PURCHASE',
  USER_SETTINGS_GET_LOCALE = 'USER_SETTINGS_GET_LOCALE',
  // END-GENERATED-SECTION
}

export const ReceiveFramePayload = zod
  .object({
    cmd: zod.string(),
    data: zod.unknown(),
    evt: zod.null(),
    nonce: zod.string(),
  })
  .passthrough();

export const Relationship = GetRelationshipsResponseSchema.shape.relationships.element;

export const User = zod.object({
  id: zod.string(),
  username: zod.string(),
  discriminator: zod.string(),
  global_name: zod.string().optional().nullable(),
  avatar: zod.string().optional().nullable(),
  avatar_decoration_data: zod
    .object({
      asset: zod.string().nullable(),
      sku_id: zod.string().optional(),
      expires_at: zod.number().optional().nullable(),
    })
    .nullable(),
  bot: zod.boolean(),
  flags: zod.number().optional().nullable(),
  public_flags: zod.number().optional().nullable(),
});

export const GuildMemberRPC = zod.object({
  user_id: zod.string(),
  nick: zod.string().optional().nullable(),
  guild_id: zod.string(),
  avatar: zod.string().optional().nullable(),
  avatar_decoration_data: zod
    .object({
      asset: zod.string().nullable(),
      sku_id: zod.string().optional().nullable(),
      expires_at: zod.number().optional().nullable(),
    })
    .optional()
    .nullable(),
  color_string: zod.string().optional().nullable(),
});

export const Emoji = zod.object({
  id: zod.string(),
  name: zod.string().optional().nullable(),
  roles: zod.array(zod.string()).optional().nullable(),
  user: User.optional().nullable(),
  require_colons: zod.boolean().optional().nullable(),
  managed: zod.boolean().optional().nullable(),
  animated: zod.boolean().optional().nullable(),
  available: zod.boolean().optional().nullable(),
});

export const VoiceState = zod.object({
  mute: zod.boolean(),
  deaf: zod.boolean(),
  self_mute: zod.boolean(),
  self_deaf: zod.boolean(),
  suppress: zod.boolean(),
});

export const UserVoiceState = zod.object({
  mute: zod.boolean(),
  nick: zod.string(),
  user: User,
  voice_state: VoiceState,
  volume: zod.number(),
});

export const Activity = zod.object({
  name: zod.string(),
  type: zod.number(),
  url: zod.string().optional().nullable(),
  created_at: zod.number().optional().nullable(),
  timestamps: zod
    .object({
      start: zod.number(),
      end: zod.number(),
    })
    .partial()
    .optional()
    .nullable(),
  application_id: zod.string().optional().nullable(),
  details: zod.string().optional().nullable(),
  details_url: zod.string().url().optional().nullable(),
  state: zod.string().optional().nullable(),
  state_url: zod.string().url().optional().nullable(),
  emoji: Emoji.optional().nullable(),
  party: zod
    .object({
      id: zod.string().optional().nullable(),
      size: zod.array(zod.number()).optional().nullable(),
    })
    .optional()
    .nullable(),
  assets: zod
    .object({
      large_image: zod.string().nullable(),
      large_text: zod.string().nullable(),
      large_url: zod.string().url().optional().nullable(),
      small_image: zod.string().nullable(),
      small_text: zod.string().nullable(),
      small_url: zod.string().url().optional().nullable(),
    })
    .partial()
    .optional()
    .nullable(),
  secrets: zod
    .object({
      join: zod.string(),
      match: zod.string(),
    })
    .partial()
    .optional()
    .nullable(),
  instance: zod.boolean().optional().nullable(),
  flags: zod.number().optional().nullable(),
});

export const ChannelTypesObject = {
  UNHANDLED: -1,
  DM: 1,
  GROUP_DM: 3,
  GUILD_TEXT: 0,
  GUILD_VOICE: 2,
  GUILD_CATEGORY: 4,
  GUILD_ANNOUNCEMENT: 5,
  GUILD_STORE: 6,
  ANNOUNCEMENT_THREAD: 10,
  PUBLIC_THREAD: 11,
  PRIVATE_THREAD: 12,
  GUILD_STAGE_VOICE: 13,
  GUILD_DIRECTORY: 14,
  GUILD_FORUM: 15,
  GUILD_MEDIA: 16,
  GUILD_APP: 21,
} as const;

export const SkuTypeObject = {
  UNHANDLED: -1,
  APPLICATION: 1,
  DLC: 2,
  CONSUMABLE: 3,
  BUNDLE: 4,
  SUBSCRIPTION: 5,
  SUBSCRIPTION_GROUP: 6,
} as const;

export const EntitlementTypesObject = {
  UNHANDLED: -1,
  PURCHASE: 1,
  PREMIUM_SUBSCRIPTION: 2,
  DEVELOPER_GIFT: 3,
  TEST_MODE_PURCHASE: 4,
  FREE_PURCHASE: 5,
  USER_GIFT: 6,
  PREMIUM_PURCHASE: 7,
} as const;

export const Entitlement = zod.object({
  id: zod.string(),
  sku_id: zod.string(),
  application_id: zod.string(),
  user_id: zod.string(),
  gift_code_flags: zod.number(),
  type: zodCoerceUnhandledValue(EntitlementTypesObject),
  gifter_user_id: zod.string().optional().nullable(),
  branches: zod.array(zod.string()).optional().nullable(),
  starts_at: zod.string().optional().nullable(), // ISO string
  ends_at: zod.string().optional().nullable(), // ISO string
  parent_id: zod.string().optional().nullable(),
  consumed: zod.boolean().optional().nullable(),
  deleted: zod.boolean().optional().nullable(),
  gift_code_batch_id: zod.string().optional().nullable(),
});

export const OrientationLockStateTypeObject = {
  UNHANDLED: -1,
  UNLOCKED: 1,
  PORTRAIT: 2,
  LANDSCAPE: 3,
} as const;

export const OrientationLockState = zodCoerceUnhandledValue(OrientationLockStateTypeObject);

export const ThermalStateTypeObject = {
  UNHANDLED: -1,
  NOMINAL: 0,
  FAIR: 1,
  SERIOUS: 2,
  CRITICAL: 3,
} as const;

export const ThermalState = zodCoerceUnhandledValue(ThermalStateTypeObject);

export const LayoutModeTypeObject = {
  UNHANDLED: -1,
  FOCUSED: 0,
  PIP: 1,
  GRID: 2,
} as const;
