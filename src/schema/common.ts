import * as zod from 'zod';
import {zodCoerceUnhandledValue} from '../utils/zodUtils';
import {AuthenticateResponseSchema} from '../generated/schemas';

// DISPATCH is sent as cmd but is a special case, so is excluded from Commands enum
export const DISPATCH = 'DISPATCH';
export enum Commands {
  AUTHORIZE = 'AUTHORIZE',
  AUTHENTICATE = 'AUTHENTICATE',
  GET_GUILDS = 'GET_GUILDS',
  GET_GUILD = 'GET_GUILD',
  GET_CHANNEL = 'GET_CHANNEL',
  GET_CHANNELS = 'GET_CHANNELS',
  SELECT_VOICE_CHANNEL = 'SELECT_VOICE_CHANNEL',
  SELECT_TEXT_CHANNEL = 'SELECT_TEXT_CHANNEL',
  SUBSCRIBE = 'SUBSCRIBE',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
  CAPTURE_SHORTCUT = 'CAPTURE_SHORTCUT',
  SET_CERTIFIED_DEVICES = 'SET_CERTIFIED_DEVICES',
  SET_ACTIVITY = 'SET_ACTIVITY',
  GET_SKUS = 'GET_SKUS',
  GET_ENTITLEMENTS = 'GET_ENTITLEMENTS',
  GET_SKUS_EMBEDDED = 'GET_SKUS_EMBEDDED',
  GET_ENTITLEMENTS_EMBEDDED = 'GET_ENTITLEMENTS_EMBEDDED',
  START_PURCHASE = 'START_PURCHASE',
  SET_CONFIG = 'SET_CONFIG',
  SEND_ANALYTICS_EVENT = 'SEND_ANALYTICS_EVENT',
  USER_SETTINGS_GET_LOCALE = 'USER_SETTINGS_GET_LOCALE',
  OPEN_EXTERNAL_LINK = 'OPEN_EXTERNAL_LINK',
  ENCOURAGE_HW_ACCELERATION = 'ENCOURAGE_HW_ACCELERATION',
  CAPTURE_LOG = 'CAPTURE_LOG',
  SET_ORIENTATION_LOCK_STATE = 'SET_ORIENTATION_LOCK_STATE',
  OPEN_INVITE_DIALOG = 'OPEN_INVITE_DIALOG',
  GET_PLATFORM_BEHAVIORS = 'GET_PLATFORM_BEHAVIORS',
  GET_CHANNEL_PERMISSIONS = 'GET_CHANNEL_PERMISSIONS',
  OPEN_SHARE_MOMENT_DIALOG = 'OPEN_SHARE_MOMENT_DIALOG',
  INITIATE_IMAGE_UPLOAD = 'INITIATE_IMAGE_UPLOAD',
  GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS = 'GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS',
  SHARE_LINK = 'SHARE_LINK',
}

export const ReceiveFramePayload = zod
  .object({
    cmd: zod.string(),
    data: zod.unknown(),
    evt: zod.null(),
    nonce: zod.string(),
  })
  .passthrough();

// TODO afgiel -- next breaking change release
// remove Scopes and ScopesObject in favor of Types.OAuthScopes
export const ScopesObject = {
  ...AuthenticateResponseSchema.shape.scopes.element.overlayType._def.innerType.options[0].Values,
  UNHANDLED: -1,
} as const;

export const Scopes = zodCoerceUnhandledValue(ScopesObject);

export const User = zod.object({
  id: zod.string(),
  username: zod.string(),
  discriminator: zod.string(),
  global_name: zod.string().optional().nullable(),
  avatar: zod.string().optional().nullable(),
  avatar_decoration_data: zod
    .object({
      asset: zod.string(),
      sku_id: zod.string().optional(),
    })
    .nullable(),
  bot: zod.boolean(),
  flags: zod.number().optional().nullable(),
  premium_type: zod.number().optional().nullable(),
});

export const GuildMember = zod.object({
  user: User,
  nick: zod.string().optional().nullable(),
  roles: zod.array(zod.string()),
  joined_at: zod.string(),
  deaf: zod.boolean(),
  mute: zod.boolean(),
});

export const GuildMemberRPC = zod.object({
  user_id: zod.string(),
  nick: zod.string().optional().nullable(),
  guild_id: zod.string(),
  avatar: zod.string().optional().nullable(),
  avatar_decoration_data: zod
    .object({
      asset: zod.string(),
      sku_id: zod.string().optional().nullable(),
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

export const StatusObject = {
  UNHANDLED: -1,
  IDLE: 'idle',
  DND: 'dnd',
  ONLINE: 'online',
  OFFLINE: 'offline',
} as const;
export const Status = zodCoerceUnhandledValue(StatusObject);

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
  state: zod.string().optional().nullable(),
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
      small_image: zod.string().nullable(),
      small_text: zod.string().nullable(),
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

export const PermissionOverwriteTypeObject = {
  UNHANDLED: -1,
  ROLE: 0,
  MEMBER: 1,
} as const;

export const PermissionOverwrite = zod.object({
  id: zod.string(),
  type: zodCoerceUnhandledValue(PermissionOverwriteTypeObject),
  allow: zod.string(),
  deny: zod.string(),
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
} as const;

export const Channel = zod.object({
  id: zod.string(),
  type: zodCoerceUnhandledValue(ChannelTypesObject),
  guild_id: zod.string().optional().nullable(),
  position: zod.number().optional().nullable(),
  permission_overwrites: zod.array(PermissionOverwrite).optional().nullable(),
  name: zod.string().optional().nullable(),
  topic: zod.string().optional().nullable(),
  nsfw: zod.boolean().optional().nullable(),
  last_message_id: zod.string().optional().nullable(),
  bitrate: zod.number().optional().nullable(),
  user_limit: zod.number().optional().nullable(),
  rate_limit_per_user: zod.number().optional().nullable(),
  recipients: zod.array(User).optional().nullable(),
  icon: zod.string().optional().nullable(),
  owner_id: zod.string().optional().nullable(),
  application_id: zod.string().optional().nullable(),
  parent_id: zod.string().optional().nullable(),
  last_pin_timestamp: zod.string().optional().nullable(),
});

export const PresenceUpdate = zod.object({
  user: User,
  guild_id: zod.string(),
  status: Status,
  activities: zod.array(Activity),
  client_status: zod
    .object({
      desktop: Status,
      mobile: Status,
      web: Status,
    })
    .partial(),
});

export const Role = zod.object({
  id: zod.string(),
  name: zod.string(),
  color: zod.number(),
  hoist: zod.boolean(),
  position: zod.number(),
  permissions: zod.string(),
  managed: zod.boolean(),
  mentionable: zod.boolean(),
});

export const Guild = zod.object({
  id: zod.string(),
  name: zod.string(),
  owner_id: zod.string(),
  icon: zod.string().nullable(),
  icon_hash: zod.string().optional().nullable(),
  splash: zod.string().nullable(),
  discovery_splash: zod.string().nullable(),
  owner: zod.boolean().optional().nullable(),
  permissions: zod.string().optional().nullable(),
  region: zod.string(),
  afk_channel_id: zod.string().nullable(),
  afk_timeout: zod.number(),
  widget_enabled: zod.boolean().optional().nullable(),
  widget_channel_id: zod.string().optional().nullable(),
  verification_level: zod.number(),
  default_message_notifications: zod.number(),
  explicit_content_filter: zod.number(),
  roles: zod.array(Role),
  emojis: zod.array(Emoji),
  features: zod.array(zod.string()),
  mfa_level: zod.number(),
  application_id: zod.string().nullable(),
  system_channel_id: zod.string().nullable(),
  system_channel_flags: zod.number(),
  rules_channel_id: zod.string().nullable(),
  joined_at: zod.string().optional().nullable(),
  large: zod.boolean().optional().nullable(),
  unavailable: zod.boolean().optional().nullable(),
  member_count: zod.number().optional().nullable(),
  voice_states: zod.array(VoiceState).optional().nullable(),
  members: zod.array(GuildMember).optional().nullable(),
  channels: zod.array(Channel).optional().nullable(),
  presences: zod.array(PresenceUpdate).optional().nullable(),
  max_presences: zod.number().optional().nullable(),
  max_members: zod.number().optional().nullable(),
  vanity_url_code: zod.string().nullable(),
  description: zod.string().nullable(),
  banner: zod.string().nullable(),
  premium_tier: zod.number(),
  premium_subscription_count: zod.number().optional().nullable(),
  preferred_locale: zod.string(),
  public_updates_channel_id: zod.string().nullable(),
  max_video_channel_users: zod.number().optional().nullable(),
  approximate_member_count: zod.number().optional().nullable(),
  approximate_presence_count: zod.number().optional().nullable(),
});

export const ChannelMention = zod.object({
  id: zod.string(),
  guild_id: zod.string(),
  type: zod.number(),
  name: zod.string(),
});

export const Attachment = zod.object({
  id: zod.string(),
  filename: zod.string(),
  size: zod.number(),
  url: zod.string(),
  proxy_url: zod.string(),
  height: zod.number().optional().nullable(),
  width: zod.number().optional().nullable(),
});

export const EmbedFooter = zod.object({
  text: zod.string(),
  icon_url: zod.string().optional().nullable(),
  proxy_icon_url: zod.string().optional().nullable(),
});

export const Image = zod.object({
  url: zod.string().optional().nullable(),
  proxy_url: zod.string().optional().nullable(),
  height: zod.number().optional().nullable(),
  width: zod.number().optional().nullable(),
});

export const Video = Image.omit({proxy_url: true});

export const EmbedProvider = zod.object({
  name: zod.string().optional().nullable(),
  url: zod.string().optional().nullable(),
});

export const EmbedAuthor = zod.object({
  name: zod.string().optional().nullable(),
  url: zod.string().optional().nullable(),
  icon_url: zod.string().optional().nullable(),
  proxy_icon_url: zod.string().optional().nullable(),
});

export const EmbedField = zod.object({
  name: zod.string(),
  value: zod.string(),
  inline: zod.boolean(),
});

export const Embed = zod.object({
  title: zod.string().optional().nullable(),
  type: zod.string().optional().nullable(),
  description: zod.string().optional().nullable(),
  url: zod.string().optional().nullable(),
  timestamp: zod.string().optional().nullable(),
  color: zod.number().optional().nullable(),
  footer: EmbedFooter.optional().nullable(),
  image: Image.optional().nullable(),
  thumbnail: Image.optional().nullable(),
  video: Video.optional().nullable(),
  provider: EmbedProvider.optional().nullable(),
  author: EmbedAuthor.optional().nullable(),
  fields: zod.array(EmbedField).optional().nullable(),
});

export const Reaction = zod.object({
  count: zod.number(),
  me: zod.boolean(),
  emoji: Emoji,
});

export const MessageActivity = zod.object({
  type: zod.number(),
  party_id: zod.string().optional().nullable(),
});

export const MessageApplication = zod.object({
  id: zod.string(),
  cover_image: zod.string().optional().nullable(),
  description: zod.string(),
  icon: zod.string().optional().nullable(),
  name: zod.string(),
});

export const MessageReference = zod.object({
  message_id: zod.string().optional().nullable(),
  channel_id: zod.string().optional().nullable(),
  guild_id: zod.string().optional().nullable(),
});

export const Message = zod.object({
  id: zod.string(),
  channel_id: zod.string(),
  guild_id: zod.string().optional().nullable(),
  author: User.optional().nullable(),
  member: GuildMember.optional().nullable(),
  content: zod.string(),
  timestamp: zod.string(),
  edited_timestamp: zod.string().optional().nullable(),
  tts: zod.boolean(),
  mention_everyone: zod.boolean(),
  mentions: zod.array(User),
  mention_roles: zod.array(zod.string()),
  mention_channels: zod.array(ChannelMention),
  attachments: zod.array(Attachment),
  embeds: zod.array(Embed),
  reactions: zod.array(Reaction).optional().nullable(),
  nonce: zod.union([zod.string(), zod.number()]).optional().nullable(),
  pinned: zod.boolean(),
  webhook_id: zod.string().optional().nullable(),
  type: zod.number(),
  activity: MessageActivity.optional().nullable(),
  application: MessageApplication.optional().nullable(),
  message_reference: MessageReference.optional().nullable(),
  flags: zod.number().optional().nullable(),
  stickers: zod.array(zod.unknown()).optional().nullable(),
  // Cannot self reference, but this is possibly a Message
  referenced_message: zod.unknown().optional().nullable(),
});

export const VoiceDevice = zod.object({
  id: zod.string(),
  name: zod.string(),
});

export const KeyTypesObject = {
  UNHANDLED: -1,
  KEYBOARD_KEY: 0,
  MOUSE_BUTTON: 1,
  KEYBOARD_MODIFIER_KEY: 2,
  GAMEPAD_BUTTON: 3,
} as const;

export const ShortcutKey = zod.object({
  type: zodCoerceUnhandledValue(KeyTypesObject),
  code: zod.number(),
  name: zod.string(),
});

export const VoiceSettingModeTypeObject = {
  UNHANDLED: -1,
  PUSH_TO_TALK: 'PUSH_TO_TALK',
  VOICE_ACTIVITY: 'VOICE_ACTIVITY',
} as const;
export const VoiceSettingsMode = zod.object({
  type: zodCoerceUnhandledValue(VoiceSettingModeTypeObject),
  auto_threshold: zod.boolean(),
  threshold: zod.number(),
  shortcut: zod.array(ShortcutKey),
  delay: zod.number(),
});

export const VoiceSettingsIO = zod.object({
  device_id: zod.string(),
  volume: zod.number(),
  available_devices: zod.array(VoiceDevice),
});

export const CertifiedDeviceTypeObject = {
  UNHANDLED: -1,
  AUDIO_INPUT: 'AUDIO_INPUT',
  AUDIO_OUTPUT: 'AUDIO_OUTPUT',
  VIDEO_INPUT: 'VIDEO_INPUT',
} as const;

export const CertifiedDevice = zod.object({
  type: zodCoerceUnhandledValue(CertifiedDeviceTypeObject),
  id: zod.string(),
  vendor: zod.object({
    name: zod.string(),
    url: zod.string(),
  }),
  model: zod.object({
    name: zod.string(),
    url: zod.string(),
  }),
  related: zod.array(zod.string()),
  echo_cancellation: zod.boolean().optional().nullable(),
  noise_suppression: zod.boolean().optional().nullable(),
  automatic_gain_control: zod.boolean().optional().nullable(),
  hardware_mute: zod.boolean().optional().nullable(),
});

export const SkuTypeObject = {
  UNHANDLED: -1,
  APPLICATION: 1,
  DLC: 2,
  CONSUMABLE: 3,
  BUNDLE: 4,
  SUBSCRIPTION: 5,
} as const;

export const Sku = zod.object({
  id: zod.string(),
  name: zod.string(),
  type: zodCoerceUnhandledValue(SkuTypeObject),
  price: zod.object({
    amount: zod.number(),
    currency: zod.string(),
  }),
  application_id: zod.string(),
  flags: zod.number(),
  release_date: zod.string().nullable(),
});

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

export const OrientationTypeObject = {
  UNHANDLED: -1,
  PORTRAIT: 0,
  LANDSCAPE: 1,
} as const;

export const Orientation = zodCoerceUnhandledValue(OrientationTypeObject);

export const LayoutModeTypeObject = {
  UNHANDLED: -1,
  FOCUSED: 0,
  PIP: 1,
  GRID: 2,
} as const;

export const LayoutMode = zodCoerceUnhandledValue(LayoutModeTypeObject);
