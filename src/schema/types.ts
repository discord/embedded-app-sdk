import * as zod from 'zod';
import * as Events from './events';
import * as Common from './common';
import type {GetActivityInstanceConnectedParticipantsResponse} from '../generated/schemas';

export type TSendCommandPayload<C extends Common.Commands = Common.Commands, I extends any = any> =
  | {
      cmd: Exclude<C, Common.Commands.SUBSCRIBE | Common.Commands.UNSUBSCRIBE>;
      args?: I;
      transfer?: Transferable[];
    }
  | {
      cmd: Common.Commands.SUBSCRIBE | Common.Commands.UNSUBSCRIBE;
      args?: I;
      evt: string;
    };

export type TSendCommand<C extends Common.Commands = Common.Commands, I extends any = any, O extends any = any> = ({
  cmd,
  args,
}: TSendCommandPayload<C, I>) => Promise<O>;

export type User = zod.infer<typeof Common.User>;
export type GuildMember = zod.infer<typeof Common.GuildMember>;
export type Emoji = zod.infer<typeof Common.Emoji>;
export type VoiceState = zod.infer<typeof Common.VoiceState>;
export type Status = zod.infer<typeof Common.Status>;
export type Activity = zod.infer<typeof Common.Activity>;
export type PermissionOverwrite = zod.infer<typeof Common.PermissionOverwrite>;
export type ChannelTypes = typeof Common.ChannelTypesObject;
export type Channel = zod.infer<typeof Common.Channel>;
export type PresenceUpdate = zod.infer<typeof Common.PresenceUpdate>;
export type Role = zod.infer<typeof Common.Role>;
export type Guild = zod.infer<typeof Common.Guild>;
export type ChannelMention = zod.infer<typeof Common.ChannelMention>;
export type Attachment = zod.infer<typeof Common.Attachment>;
export type EmbedFooter = zod.infer<typeof Common.EmbedFooter>;
export type Image = zod.infer<typeof Common.Image>;
export type Video = zod.infer<typeof Common.Video>;
export type EmbedProvider = zod.infer<typeof Common.EmbedProvider>;
export type EmbedField = zod.infer<typeof Common.EmbedField>;
export type Embed = zod.infer<typeof Common.Embed>;
export type Reaction = zod.infer<typeof Common.Reaction>;
export type MessageActivity = zod.infer<typeof Common.MessageActivity>;
export type MessageReference = zod.infer<typeof Common.MessageReference>;
export type Message = zod.infer<typeof Common.Message>;
export type VoiceDevice = zod.infer<typeof Common.VoiceDevice>;
export type KeyTypes = typeof Common.KeyTypesObject;
export type ShortcutKey = zod.infer<typeof Common.ShortcutKey>;
export type VoiceSettingsMode = zod.infer<typeof Common.VoiceSettingsMode>;
export type VoiceSettingsIO = zod.infer<typeof Common.VoiceSettingsIO>;
export type CertifiedDevice = zod.infer<typeof Common.CertifiedDevice>;

export type ScopesObject = typeof Common.ScopesObject;
export type StatusObject = typeof Common.StatusObject;
export type PermissionOverwriteTypeEnum = typeof Common.PermissionOverwriteTypeObject;
export type ChannelTypesObject = typeof Common.ChannelTypesObject;
export type KeyTypesObject = typeof Common.KeyTypesObject;
export type VoiceSettingModeTypeObject = typeof Common.VoiceSettingModeTypeObject;
export type CertifiedDeviceTypeObject = typeof Common.CertifiedDeviceTypeObject;
export type SkuTypeObject = typeof Common.SkuTypeObject;
export type EntitlementTypesObject = typeof Common.EntitlementTypesObject;

export type VoiceConnectionStatusStateObject = typeof Events.VoiceConnectionStatusStateObject;
export type ActivityJoinIntentObject = typeof Events.ActivityJoinIntentObject;

export type OrientationLockStateTypeObject = typeof Common.OrientationLockStateTypeObject;
export type ThermalStateTypeObject = typeof Common.ThermalStateTypeObject;
export type OrientationTypeObject = typeof Common.OrientationTypeObject;
export type LayoutModeTypeObject = typeof Common.LayoutModeTypeObject;

export type OAuthScopes =
  | 'bot'
  | 'rpc'
  | 'identify'
  | 'connections'
  | 'email'
  | 'guilds'
  | 'guilds.join'
  | 'guilds.members.read'
  | 'gdm.join'
  | 'messages.read'
  | 'rpc.notifications.read'
  | 'rpc.voice.write'
  | 'rpc.voice.read'
  | 'rpc.activities.write'
  | 'webhook.incoming'
  | 'applications.commands'
  | 'applications.builds.upload'
  | 'applications.builds.read'
  | 'applications.store.update'
  | 'applications.entitlements'
  | 'relationships.read'
  | 'activities.read'
  | 'activities.write'
  | 'dm_channels.read';

export type {GetActivityInstanceConnectedParticipantsResponse};
