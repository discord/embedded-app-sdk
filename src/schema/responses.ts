import * as zod from 'zod';
import {
  GuildMember,
  Message,
  Channel,
  ShortcutKey,
  VoiceSettingsMode,
  VoiceSettingsIO,
  Activity,
  Entitlement,
  Commands,
  Sku,
  UserVoiceState,
  ChannelTypesObject,
  ReceiveFramePayload,
} from './common';
import {fallbackToDefault, zodCoerceUnhandledValue} from '../utils/zodUtils';
import {Schemas, AuthenticateResponseSchema, InitiateImageUploadResponseSchema} from '../generated/schemas';
import assertUnreachable from '../utils/assertUnreachable';

export const EmptyResponse = zod.object({}).nullable();

export const AuthorizeResponse = zod.object({
  code: zod.string(),
});

export {AuthenticateResponseSchema as AuthenticateResponse};

export const GetGuildsResponse = zod.object({
  guilds: zod.array(
    zod.object({
      id: zod.string(),
      name: zod.string(),
    }),
  ),
});

export const GetGuildResponse = zod.object({
  id: zod.string(),
  name: zod.string(),
  icon_url: zod.string().optional(),
  members: zod.array(GuildMember),
});

export const GetChannelResponse = zod.object({
  id: zod.string(),
  type: zodCoerceUnhandledValue(ChannelTypesObject),
  guild_id: zod.string().optional().nullable(),
  name: zod.string().optional().nullable(),
  topic: zod.string().optional().nullable(),
  bitrate: zod.number().optional().nullable(),
  user_limit: zod.number().optional().nullable(),
  position: zod.number().optional().nullable(),
  voice_states: zod.array(UserVoiceState),
  messages: zod.array(Message),
});

export const GetChannelsResponse = zod.object({
  channels: zod.array(Channel),
});

export const NullableChannelResponse = GetChannelResponse.nullable();
export const SelectVoiceChannelResponse = GetChannelResponse.nullable();
export const SelectTextChannelResponse = GetChannelResponse.nullable();

export const VoiceSettingsResponse = zod.object({
  input: VoiceSettingsIO,
  output: VoiceSettingsIO,
  mode: VoiceSettingsMode,
  automatic_gain_control: zod.boolean(),
  echo_cancellation: zod.boolean(),
  noise_suppression: zod.boolean(),
  qos: zod.boolean(),
  silence_warning: zod.boolean(),
  deaf: zod.boolean(),
  mute: zod.boolean(),
});

export const SubscribeResponse = zod.object({
  evt: zod.string(),
});

export const CaptureShortcutResponse = zod.object({shortcut: ShortcutKey});

export const SetActivityResponse = Activity;

export const GetSkusResponse = zod.object({skus: zod.array(Sku)});

export const GetEntitlementsResponse = zod.object({entitlements: zod.array(Entitlement)});

export const StartPurchaseResponse = zod.array(Entitlement).nullable();

export const SetConfigResponse = zod.object({
  use_interactive_pip: zod.boolean(),
});

export const UserSettingsGetLocaleResponse = zod.object({
  locale: zod.string(),
});

export const EncourageHardwareAccelerationResponse = zod.object({
  enabled: zod.boolean(),
});

export const GetChannelPermissionsResponse = zod.object({
  permissions: zod.bigint().or(zod.string()),
});

export const OpenExternalLinkResponse = fallbackToDefault(
  zod.object({opened: zod.boolean().or(zod.null())}).default({opened: null}),
);

export {InitiateImageUploadResponseSchema as InitiateImageUploadResponse};

/**
 * Because of the nature of Platform Behavior changes
 * every key/value is optional and may eventually be removed
 */
export const GetPlatformBehaviorsResponse = zod.object({
  iosKeyboardResizesView: zod.optional(zod.boolean()),
});

export const ResponseFrame = ReceiveFramePayload.extend({
  cmd: zod.nativeEnum(Commands),
  evt: zod.null(),
});

function parseResponseData({cmd, data}: zod.infer<typeof ResponseFrame>) {
  switch (cmd) {
    case Commands.AUTHORIZE:
      return AuthorizeResponse.parse(data);
    case Commands.CAPTURE_SHORTCUT:
      return CaptureShortcutResponse.parse(data);
    case Commands.ENCOURAGE_HW_ACCELERATION:
      return EncourageHardwareAccelerationResponse.parse(data);
    case Commands.GET_CHANNEL:
      return GetChannelResponse.parse(data);
    case Commands.GET_CHANNELS:
      return GetChannelsResponse.parse(data);
    case Commands.GET_CHANNEL_PERMISSIONS:
      return GetChannelPermissionsResponse.parse(data);
    case Commands.GET_GUILD:
      return GetGuildResponse.parse(data);
    case Commands.GET_GUILDS:
      return GetGuildsResponse.parse(data);
    case Commands.GET_PLATFORM_BEHAVIORS:
      return GetPlatformBehaviorsResponse.parse(data);
    case Commands.GET_CHANNEL:
      return GetChannelResponse.parse(data);
    case Commands.SELECT_TEXT_CHANNEL:
      return SelectTextChannelResponse.parse(data);
    case Commands.SELECT_VOICE_CHANNEL:
      return SelectVoiceChannelResponse.parse(data);
    case Commands.SET_ACTIVITY:
      return SetActivityResponse.parse(data);
    case Commands.GET_SKUS_EMBEDDED:
      return GetSkusResponse.parse(data);
    case Commands.GET_ENTITLEMENTS_EMBEDDED:
      return GetEntitlementsResponse.parse(data);
    case Commands.SET_CONFIG:
      return SetConfigResponse.parse(data);
    case Commands.START_PURCHASE:
      return StartPurchaseResponse.parse(data);
    case Commands.SUBSCRIBE:
    case Commands.UNSUBSCRIBE:
      return SubscribeResponse.parse(data);
    case Commands.USER_SETTINGS_GET_LOCALE:
      return UserSettingsGetLocaleResponse.parse(data);
    case Commands.OPEN_EXTERNAL_LINK:
      return OpenExternalLinkResponse.parse(data);
    // Empty Responses
    case Commands.SET_ORIENTATION_LOCK_STATE:
    case Commands.SET_CERTIFIED_DEVICES:
    case Commands.SEND_ANALYTICS_EVENT:
    case Commands.OPEN_INVITE_DIALOG:
    case Commands.CAPTURE_LOG:
    case Commands.GET_SKUS:
    case Commands.GET_ENTITLEMENTS:
      return EmptyResponse.parse(data);
    // Generated Responses
    case Commands.AUTHENTICATE:
    case Commands.INITIATE_IMAGE_UPLOAD:
    case Commands.OPEN_SHARE_MOMENT_DIALOG:
    case Commands.GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS:
    case Commands.SHARE_LINK:
      const {response} = Schemas[cmd];
      return response.parse(data);
    default:
      assertUnreachable(cmd, new Error(`Unrecognized command ${cmd}`));
  }
}

export function parseResponsePayload(payload: zod.infer<typeof ResponseFrame>) {
  return {
    ...payload,
    data: parseResponseData(payload),
  };
}
