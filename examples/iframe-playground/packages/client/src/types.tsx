import type {CommandResponseTypes} from '@discord/embedded-app-sdk';
export type TAuthenticatedContext = CommandResponseTypes['authenticate'] & {guildMember: IGuildsMembersRead | null};

export interface IGuildsMembersRead {
  roles: string[];
  nick: string | null;
  avatar: string | null;
  premium_since: string | null;
  joined_at: string;
  is_pending: boolean;
  pending: boolean;
  communication_disabled_until: string | null;
  user: {
    id: string;
    username: string;
    avatar: string | null;
    discriminator: string;
    public_flags: number;
  };
  mute: boolean;
  deaf: boolean;
}

// TODO: Can we reuse the existing enum from the SDK package?
// https://app.asana.com/0/1202090529698493/1205406173366737/f
export enum SkuType {
  UNHANDLED = -1,
  DURABLE_PRIMARY = 1,
  DURABLE = 2,
  CONSUMABLE = 3,
  BUNDLE = 4,
  SUBSCRIPTION = 5,
  SUBSCRIPTION_GROUP = 6,
}

export interface Sku {
  type: SkuType;
  id: string;
  name: string;
  application_id: string;
  price: {
    amount: number;
    currency: string;
  };
}

export interface Entitlement {
  parent_id?: string | null | undefined;
  gifter_user_id?: string | null | undefined;
  branches?: string[] | null | undefined;
  starts_at?: string | null | undefined; // ISO string
  ends_at?: string | null | undefined; // ISO string
  consumed?: boolean | null | undefined;
  deleted?: boolean | null | undefined;
  gift_code_batch_id?: string | null | undefined;
  type: 4 | 1 | 2 | 3 | 5 | 6 | 7;
  id: string;
  application_id: string;
  user_id: string;
  sku_id: string;
  gift_code_flags: number;
}

export type VoiceChannel = {
  name?: string | null | undefined;
  position?: number | null | undefined;
  guild_id?: string | null | undefined;
  topic?: string | null | undefined;
  bitrate?: number | null | undefined;
  user_limit?: number | null | undefined;
  type: 0 | 4 | 1 | 2 | 3 | 5 | 6;
  id: string;
  voice_states: Array<{
    mute: boolean;
    user: {
      avatar?: string | null | undefined;
      publicFlags?: number | null | undefined;
      id: string;
      username: string;
      discriminator: string;
    };
    nick: string;
    voice_state: {
      mute: boolean;
      deaf: boolean;
      self_mute: boolean;
      self_deaf: boolean;
      suppress: boolean;
    };
    volume: number;
  }>;
  messages: Array<{
    nonce?: string | number | null | undefined;
    flags?: number | null | undefined;
    guild_id?: string | null | undefined;
    author?:
      | {
          avatar?: string | null | undefined;
          publicFlags?: number | null | undefined;
          id: string;
          username: string;
          discriminator: string;
        }
      | null
      | undefined;
    application?:
      | {
          icon?: string | null | undefined;
          cover_image?: string | null | undefined;
          id: string;
          name: string;
          description: string;
        }
      | null
      | undefined;
    member?:
      | {
          nick?: string | null | undefined;
          mute: boolean;
          deaf: boolean;
          roles: string[];
          user: {
            avatar?: string | null | undefined;
            publicFlags?: number | null | undefined;
            id: string;
            username: string;
            discriminator: string;
          };
          joined_at: string;
        }
      | null
      | undefined;
    edited_timestamp?: string | null | undefined;
    reactions?:
      | Array<{
          emoji: {
            name?: string | null | undefined;
            roles?: string[] | null | undefined;
            user?:
              | {
                  avatar?: string | null | undefined;
                  publicFlags?: number | null | undefined;
                  id: string;
                  username: string;
                  discriminator: string;
                }
              | null
              | undefined;
            require_colons?: boolean | null | undefined;
            managed?: boolean | null | undefined;
            animated?: boolean | null | undefined;
            available?: boolean | null | undefined;
            id: string;
          };
          count: number;
          me: boolean;
        }>
      | null
      | undefined;
    webhook_id?: string | null | undefined;
    activity?:
      | {
          party_id?: string | null | undefined;
          type: number;
        }
      | null
      | undefined;
    message_reference?:
      | {
          guild_id?: string | null | undefined;
          message_id?: string | null | undefined;
          channel_id?: string | null | undefined;
        }
      | null
      | undefined;
    stickers?: unknown[] | null | undefined;
    referenced_message?: unknown;
    type: number;
    id: string;
    timestamp: string;
    channel_id: string;
    content: string;
    tts: boolean;
    mention_everyone: boolean;
    mentions: Array<{
      avatar?: string | null | undefined;
      publicFlags?: number | null | undefined;
      id: string;
      username: string;
      discriminator: string;
    }>;
    mention_roles: string[];
    mention_channels: Array<{
      type: number;
      id: string;
      name: string;
      guild_id: string;
    }>;
    attachments: Array<{
      height?: number | null | undefined;
      width?: number | null | undefined;
      id: string;
      size: number;
      url: string;
      proxy_url: string;
      filename: string;
    }>;
    embeds: Array<{
      type?: string | null | undefined;
      url?: string | null | undefined;
      color?: number | null | undefined;
      title?: string | null | undefined;
      description?: string | null | undefined;
      timestamp?: string | null | undefined;
      footer?:
        | {
            icon_url?: string | null | undefined;
            proxy_icon_url?: string | null | undefined;
            text: string;
          }
        | null
        | undefined;
      image?:
        | {
            url?: string | null | undefined;
            proxy_url?: string | null | undefined;
            height?: number | null | undefined;
            width?: number | null | undefined;
          }
        | null
        | undefined;
      thumbnail?:
        | {
            url?: string | null | undefined;
            proxy_url?: string | null | undefined;
            height?: number | null | undefined;
            width?: number | null | undefined;
          }
        | null
        | undefined;
      video?:
        | {
            url?: string | null | undefined;
            height?: number | null | undefined;
            width?: number | null | undefined;
          }
        | null
        | undefined;
      provider?:
        | {
            name?: string | null | undefined;
            url?: string | null | undefined;
          }
        | null
        | undefined;
      author?:
        | {
            name?: string | null | undefined;
            url?: string | null | undefined;
            icon_url?: string | null | undefined;
            proxy_icon_url?: string | null | undefined;
          }
        | null
        | undefined;
      fields?:
        | Array<{
            name: string;
            value: string;
            inline: boolean;
          }>
        | null
        | undefined;
    }>;
    pinned: boolean;
  }>;
} | null;
