/**
 * This file is generated.
 * Run "npm run sync" to regenerate file.
 * @generated
 */
import {z, infer as zInfer} from 'zod';
import {fallbackToDefault, zodUnionWithUnhandled} from '../utils/zodUtils';

// INITIATE_IMAGE_UPLOAD
export const InitiateImageUploadResponseSchema = z.object({image_url: z.string()});
export type InitiateImageUploadResponse = zInfer<typeof InitiateImageUploadResponseSchema>;

// OPEN_SHARE_MOMENT_DIALOG
export const OpenShareMomentDialogRequestSchema = z.object({mediaUrl: z.string().max(1024)});
export type OpenShareMomentDialogRequest = zInfer<typeof OpenShareMomentDialogRequestSchema>;

// AUTHENTICATE
export const AuthenticateRequestSchema = z.object({access_token: z.union([z.string(), z.null()]).optional()});
export type AuthenticateRequest = zInfer<typeof AuthenticateRequestSchema>;
export const AuthenticateResponseSchema = z.object({
  access_token: z.string(),
  user: z.object({
    username: z.string(),
    discriminator: z.string(),
    id: z.string(),
    avatar: z.union([z.string(), z.null()]).optional(),
    public_flags: z.number(),
    global_name: z.union([z.string(), z.null()]).optional(),
  }),
  scopes: z.array(
    fallbackToDefault(
      z
        .enum([
          'identify',
          'identify.premium',
          'email',
          'connections',
          'guilds',
          'guilds.join',
          'guilds.members.read',
          'guilds.channels.read',
          'gdm.join',
          'bot',
          'rpc',
          'rpc.notifications.read',
          'rpc.voice.read',
          'rpc.voice.write',
          'rpc.video.read',
          'rpc.video.write',
          'rpc.screenshare.read',
          'rpc.screenshare.write',
          'rpc.activities.write',
          'webhook.incoming',
          'messages.read',
          'applications.builds.upload',
          'applications.builds.read',
          'applications.commands',
          'applications.commands.permissions.update',
          'applications.commands.update',
          'applications.store.update',
          'applications.entitlements',
          'activities.read',
          'activities.write',
          'activities.invites.write',
          'relationships.read',
          'relationships.write',
          'voice',
          'dm_channels.read',
          'role_connections.write',
          'presences.read',
          'presences.write',
          'openid',
          'dm_channels.messages.read',
          'dm_channels.messages.write',
          'gateway.connect',
          'account.global_name.update',
          'payment_sources.country_code',
          'sdk.social_layer_presence',
          'sdk.social_layer',
          'lobbies.write',
          'application_identities.write',
          'managed_platform.application_identities.write',
          'orbs_arcade.play',
          'personal.relationships.read',
          'personal.dm_channels.read',
          'personal.dm_channels.messages.read',
          'personal.guilds.channels.read',
          'personal.guilds.channels.messages.read',
          'personal.activities.write',
          'personal.mentions.read',
          'personal.guilds.messages.search',
          'personal.dm_channels.messages.search',
        ])
        .or(z.literal(-1))
        .default(-1),
    ),
  ),
  expires: z.string(),
  application: z.object({
    description: z.string(),
    icon: z.union([z.string(), z.null()]).optional(),
    id: z.string(),
    rpc_origins: z.array(z.string()).optional(),
    name: z.string(),
  }),
});
export type AuthenticateResponse = zInfer<typeof AuthenticateResponseSchema>;

// GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS
export const GetActivityInstanceConnectedParticipantsResponseSchema = z.object({
  participants: z.array(
    z.object({
      id: z.string(),
      username: z.string(),
      global_name: z.union([z.string(), z.null()]).optional(),
      discriminator: z.string(),
      avatar: z.union([z.string(), z.null()]).optional(),
      flags: z.number(),
      public_flags: z.number().optional(),
      bot: z.boolean(),
      avatar_decoration_data: z
        .union([
          z.object({
            asset: z.string(),
            sku_id: z.string().optional(),
            expires_at: z.union([z.number(), z.null()]).optional(),
          }),
          z.null(),
        ])
        .optional(),
      nickname: z.string().optional(),
    }),
  ),
});
export type GetActivityInstanceConnectedParticipantsResponse = zInfer<
  typeof GetActivityInstanceConnectedParticipantsResponseSchema
>;

// SHARE_LINK
export const ShareLinkRequestSchema = z.object({
  custom_id: z.string().max(64).optional(),
  message: z.string().max(1000),
  link_id: z.string().max(64).optional(),
});
export type ShareLinkRequest = zInfer<typeof ShareLinkRequestSchema>;
export const ShareLinkResponseSchema = z.object({
  success: z.boolean(),
  didCopyLink: z.boolean(),
  didSendMessage: z.boolean(),
});
export type ShareLinkResponse = zInfer<typeof ShareLinkResponseSchema>;

// OPEN_USER_PROFILE
export const OpenUserProfileRequestSchema = z.object({user_id: z.string().max(64)});
export type OpenUserProfileRequest = zInfer<typeof OpenUserProfileRequestSchema>;
export const OpenUserProfileResponseSchema = z.object({opened: z.boolean()});
export type OpenUserProfileResponse = zInfer<typeof OpenUserProfileResponseSchema>;

// GET_RELATIONSHIPS
export const GetRelationshipsResponseSchema = z.object({
  relationships: z.array(
    z.object({
      type: z.number(),
      user: z.object({
        id: z.string(),
        username: z.string(),
        global_name: z.union([z.string(), z.null()]).optional(),
        discriminator: z.string(),
        avatar: z.union([z.string(), z.null()]).optional(),
        flags: z.number(),
        public_flags: z.number().optional(),
        bot: z.boolean(),
        avatar_decoration_data: z
          .union([
            z.object({
              asset: z.string(),
              sku_id: z.string().optional(),
              expires_at: z.union([z.number(), z.null()]).optional(),
            }),
            z.null(),
          ])
          .optional(),
      }),
      presence: z
        .object({
          status: z.string(),
          activity: z
            .union([
              z.object({
                session_id: z.string().optional(),
                type: z.number().optional(),
                name: z.string(),
                url: z.union([z.string(), z.null()]).optional(),
                application_id: z.string().optional(),
                status_display_type: z.number().optional(),
                state: z.string().optional(),
                state_url: z.string().optional(),
                details: z.string().optional(),
                details_url: z.string().optional(),
                emoji: z
                  .union([
                    z.object({
                      name: z.string(),
                      id: z.union([z.string(), z.null()]).optional(),
                      animated: z.union([z.boolean(), z.null()]).optional(),
                    }),
                    z.null(),
                  ])
                  .optional(),
                assets: z
                  .object({
                    large_image: z.string().optional(),
                    large_text: z.string().optional(),
                    large_url: z.string().optional(),
                    small_image: z.string().optional(),
                    small_text: z.string().optional(),
                    small_url: z.string().optional(),
                  })
                  .optional(),
                timestamps: z.object({start: z.number().optional(), end: z.number().optional()}).optional(),
                party: z
                  .object({
                    id: z.string().optional(),
                    size: z.array(z.number()).min(2).max(2).optional(),
                    privacy: z.number().optional(),
                  })
                  .optional(),
                secrets: z.object({match: z.string().optional(), join: z.string().optional()}).optional(),
                sync_id: z.string().optional(),
                created_at: z.number().optional(),
                instance: z.boolean().optional(),
                flags: z.number().optional(),
                metadata: z.object({button_urls: z.array(z.string()).optional()}).optional(),
                platform: z.string().optional(),
                supported_platforms: z.array(z.string()).optional(),
                buttons: z.array(z.string()).optional(),
              }),
              z.null(),
            ])
            .optional(),
        })
        .optional(),
    }),
  ),
});
export type GetRelationshipsResponse = zInfer<typeof GetRelationshipsResponseSchema>;

// INVITE_USER_EMBEDDED
export const InviteUserEmbeddedRequestSchema = z.object({
  user_id: z.string(),
  content: z.string().min(0).max(1024).optional(),
});
export type InviteUserEmbeddedRequest = zInfer<typeof InviteUserEmbeddedRequestSchema>;

// GET_CONTEXT
export const GetContextResponseSchema = z.object({
  surface: zodUnionWithUnhandled([
    z.object({type: z.literal(0), channel_id: z.string().optional(), guild_id: z.string().optional()}),
    z.object({type: z.literal(1), channel_id: z.string(), guild_id: z.string().optional()}),
    z.object({type: z.literal(2), channel_id: z.string(), guild_id: z.string().optional()}),
    z.object({type: z.literal(3), channel_id: z.string(), guild_id: z.string().optional()}),
    z.object({type: z.literal(4)}),
  ]),
  launch: z.object({
    custom_id: z.string().optional(),
    referrer_id: z.string().optional(),
    interaction_id: z.string().optional(),
  }),
  platform: fallbackToDefault(z.enum(['desktop', 'mobile']).or(z.literal(-1)).default(-1)),
});
export type GetContextResponse = zInfer<typeof GetContextResponseSchema>;

// GET_USER
export const GetUserRequestSchema = z.object({id: z.string().max(64)});
export type GetUserRequest = zInfer<typeof GetUserRequestSchema>;
export const GetUserResponseSchema = z.union([
  z.object({
    id: z.string(),
    username: z.string(),
    global_name: z.union([z.string(), z.null()]).optional(),
    discriminator: z.string(),
    avatar: z.union([z.string(), z.null()]).optional(),
    flags: z.number(),
    public_flags: z.number().optional(),
    bot: z.boolean(),
    avatar_decoration_data: z
      .union([
        z.object({
          asset: z.string(),
          sku_id: z.string().optional(),
          expires_at: z.union([z.number(), z.null()]).optional(),
        }),
        z.null(),
      ])
      .optional(),
  }),
  z.null(),
]);
export type GetUserResponse = zInfer<typeof GetUserResponseSchema>;

// GET_CURRENT_USER
export const GetCurrentUserResponseSchema = z.union([
  z.object({
    id: z.string(),
    username: z.string(),
    global_name: z.union([z.string(), z.null()]).optional(),
    discriminator: z.string(),
    avatar: z.union([z.string(), z.null()]).optional(),
    flags: z.number(),
    public_flags: z.number().optional(),
    bot: z.boolean(),
    avatar_decoration_data: z
      .union([
        z.object({
          asset: z.string(),
          sku_id: z.string().optional(),
          expires_at: z.union([z.number(), z.null()]).optional(),
        }),
        z.null(),
      ])
      .optional(),
  }),
  z.null(),
]);
export type GetCurrentUserResponse = zInfer<typeof GetCurrentUserResponseSchema>;

// GET_QUEST_ENROLLMENT_STATUS
export const GetQuestEnrollmentStatusRequestSchema = z.object({quest_id: z.string()});
export type GetQuestEnrollmentStatusRequest = zInfer<typeof GetQuestEnrollmentStatusRequestSchema>;
export const GetQuestEnrollmentStatusResponseSchema = z.object({
  quest_id: z.string(),
  is_enrolled: z.boolean(),
  enrolled_at: z.union([z.string(), z.null()]).optional(),
});
export type GetQuestEnrollmentStatusResponse = zInfer<typeof GetQuestEnrollmentStatusResponseSchema>;

// QUEST_START_TIMER
export const QuestStartTimerRequestSchema = z.object({quest_id: z.string()});
export type QuestStartTimerRequest = zInfer<typeof QuestStartTimerRequestSchema>;
export const QuestStartTimerResponseSchema = z.object({success: z.boolean()});
export type QuestStartTimerResponse = zInfer<typeof QuestStartTimerResponseSchema>;

// GET_QUEST
export const GetQuestResponseSchema = z.object({
  quest_id: z.string(),
  enrolled_at: z.union([z.string(), z.null()]).optional(),
  completed_at: z.union([z.string(), z.null()]).optional(),
  external_cta_url: z.string(),
});
export type GetQuestResponse = zInfer<typeof GetQuestResponseSchema>;

// REQUEST_PROXY_TICKET_REFRESH
export const RequestProxyTicketRefreshResponseSchema = z.object({ticket: z.string()});
export type RequestProxyTicketRefreshResponse = zInfer<typeof RequestProxyTicketRefreshResponseSchema>;

// CAPTURE_LOG
export const CaptureLogRequestSchema = z.object({level: z.string().max(10), message: z.string().max(1000)});
export type CaptureLogRequest = zInfer<typeof CaptureLogRequestSchema>;

// ENCOURAGE_HW_ACCELERATION
export const EncourageHwAccelerationResponseSchema = z.object({enabled: z.boolean()});
export type EncourageHwAccelerationResponse = zInfer<typeof EncourageHwAccelerationResponseSchema>;

// GET_PLATFORM_BEHAVIORS
export const GetPlatformBehaviorsResponseSchema = z.object({iosKeyboardResizesView: z.boolean().optional()});
export type GetPlatformBehaviorsResponse = zInfer<typeof GetPlatformBehaviorsResponseSchema>;

// USER_SETTINGS_GET_LOCALE
export const UserSettingsGetLocaleResponseSchema = z.object({locale: z.string()});
export type UserSettingsGetLocaleResponse = zInfer<typeof UserSettingsGetLocaleResponseSchema>;

// SET_ORIENTATION_LOCK_STATE
export const SetOrientationLockStateRequestSchema = z.object({
  lock_state: fallbackToDefault(
    z
      .union([z.literal(1), z.literal(2), z.literal(3)])
      .or(z.literal(-1))
      .default(-1),
  ),
  picture_in_picture_lock_state: fallbackToDefault(
    z
      .union([z.literal(1), z.literal(2), z.literal(3), z.literal(null)])
      .or(z.literal(-1))
      .default(-1),
  ).optional(),
  grid_lock_state: fallbackToDefault(
    z
      .union([z.literal(1), z.literal(2), z.literal(3), z.literal(null)])
      .or(z.literal(-1))
      .default(-1),
  ).optional(),
});
export type SetOrientationLockStateRequest = zInfer<typeof SetOrientationLockStateRequestSchema>;

// SET_CONFIG
export const SetConfigRequestSchema = z.object({use_interactive_pip: z.boolean()});
export type SetConfigRequest = zInfer<typeof SetConfigRequestSchema>;
export const SetConfigResponseSchema = z.object({use_interactive_pip: z.boolean()});
export type SetConfigResponse = zInfer<typeof SetConfigResponseSchema>;

// OPEN_INVITE_DIALOG

// OPEN_EXTERNAL_LINK
export const OpenExternalLinkRequestSchema = z.object({url: z.string().max(8000)});
export type OpenExternalLinkRequest = zInfer<typeof OpenExternalLinkRequestSchema>;
export const OpenExternalLinkResponseSchema = fallbackToDefault(
  z.object({opened: z.union([z.boolean(), z.null()])}).default({opened: null}),
);
export type OpenExternalLinkResponse = zInfer<typeof OpenExternalLinkResponseSchema>;

// GET_CHANNEL_PERMISSIONS
export const GetChannelPermissionsResponseSchema = z.object({permissions: z.bigint().or(z.string())});
export type GetChannelPermissionsResponse = zInfer<typeof GetChannelPermissionsResponseSchema>;

// GET_SKUS_EMBEDDED
export const GetSkusEmbeddedResponseSchema = z.object({
  skus: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: fallbackToDefault(
        z
          .union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6)])
          .or(z.literal(-1))
          .default(-1),
      ),
      price: z.object({amount: z.number(), currency: z.string()}),
      application_id: z.string(),
      flags: z.number(),
      release_date: z.union([z.string(), z.null()]),
    }),
  ),
});
export type GetSkusEmbeddedResponse = zInfer<typeof GetSkusEmbeddedResponseSchema>;

// GET_ENTITLEMENTS_EMBEDDED
export const GetEntitlementsEmbeddedResponseSchema = z.object({
  entitlements: z.array(
    z.object({
      id: z.string(),
      sku_id: z.string(),
      application_id: z.string(),
      user_id: z.string(),
      gift_code_flags: z.number(),
      type: fallbackToDefault(
        z
          .union([
            z.literal(1),
            z.literal(2),
            z.literal(3),
            z.literal(4),
            z.literal(5),
            z.literal(6),
            z.literal(7),
            z.literal(8),
            z.literal(9),
            z.literal(10),
            z.literal(11),
            z.literal(12),
            z.literal(13),
            z.literal(14),
            z.literal(15),
            z.literal(16),
            z.literal(17),
          ])
          .or(z.literal(-1))
          .default(-1),
      ),
      gifter_user_id: z.union([z.string(), z.null()]).optional(),
      branches: z.union([z.array(z.string()), z.null()]).optional(),
      starts_at: z.union([z.string(), z.null()]).optional(),
      ends_at: z.union([z.string(), z.null()]).optional(),
      parent_id: z.union([z.string(), z.null()]).optional(),
      consumed: z.union([z.boolean(), z.null()]).optional(),
      deleted: z.union([z.boolean(), z.null()]).optional(),
      gift_code_batch_id: z.union([z.string(), z.null()]).optional(),
    }),
  ),
});
export type GetEntitlementsEmbeddedResponse = zInfer<typeof GetEntitlementsEmbeddedResponseSchema>;

// START_PURCHASE
export const StartPurchaseRequestSchema = z.object({sku_id: z.string(), pid: z.number().gte(0).optional()});
export type StartPurchaseRequest = zInfer<typeof StartPurchaseRequestSchema>;
export const StartPurchaseResponseSchema = z.union([
  z.array(
    z.object({
      id: z.string(),
      sku_id: z.string(),
      application_id: z.string(),
      user_id: z.string(),
      gift_code_flags: z.number(),
      type: fallbackToDefault(
        z
          .union([
            z.literal(1),
            z.literal(2),
            z.literal(3),
            z.literal(4),
            z.literal(5),
            z.literal(6),
            z.literal(7),
            z.literal(8),
            z.literal(9),
            z.literal(10),
            z.literal(11),
            z.literal(12),
            z.literal(13),
            z.literal(14),
            z.literal(15),
            z.literal(16),
            z.literal(17),
          ])
          .or(z.literal(-1))
          .default(-1),
      ),
      gifter_user_id: z.union([z.string(), z.null()]).optional(),
      branches: z.union([z.array(z.string()), z.null()]).optional(),
      starts_at: z.union([z.string(), z.null()]).optional(),
      ends_at: z.union([z.string(), z.null()]).optional(),
      parent_id: z.union([z.string(), z.null()]).optional(),
      consumed: z.union([z.boolean(), z.null()]).optional(),
      deleted: z.union([z.boolean(), z.null()]).optional(),
      gift_code_batch_id: z.union([z.string(), z.null()]).optional(),
    }),
  ),
  z.null(),
]);
export type StartPurchaseResponse = zInfer<typeof StartPurchaseResponseSchema>;

// GET_CHANNEL
export const GetChannelRequestSchema = z.object({channel_id: z.string()});
export type GetChannelRequest = zInfer<typeof GetChannelRequestSchema>;
export const GetChannelResponseSchema = z.object({
  id: z.string(),
  type: fallbackToDefault(
    z
      .union([
        z.literal(1),
        z.literal(3),
        z.literal(0),
        z.literal(2),
        z.literal(4),
        z.literal(5),
        z.literal(6),
        z.literal(10),
        z.literal(11),
        z.literal(12),
        z.literal(13),
        z.literal(14),
        z.literal(15),
        z.literal(16),
        z.literal(17),
        z.literal(18),
        z.literal(19),
        z.literal(20),
        z.literal(21),
        z.literal(10000),
      ])
      .or(z.literal(-1))
      .default(-1),
  ),
  guild_id: z.union([z.string(), z.null()]).optional(),
  name: z.union([z.string(), z.null()]).optional(),
  topic: z.union([z.string(), z.null()]).optional(),
  bitrate: z.union([z.number(), z.null()]).optional(),
  user_limit: z.union([z.number(), z.null()]).optional(),
  position: z.union([z.number(), z.null()]).optional(),
  voice_states: z.array(
    z.object({
      mute: z.boolean(),
      nick: z.string(),
      user: z.object({
        id: z.string(),
        username: z.string(),
        global_name: z.union([z.string(), z.null()]).optional(),
        discriminator: z.string(),
        avatar: z.union([z.string(), z.null()]).optional(),
        flags: z.number(),
        public_flags: z.number().optional(),
        bot: z.boolean(),
        avatar_decoration_data: z
          .union([
            z.object({
              asset: z.string(),
              sku_id: z.string().optional(),
              expires_at: z.union([z.number(), z.null()]).optional(),
            }),
            z.null(),
          ])
          .optional(),
      }),
      voice_state: z.object({
        mute: z.boolean(),
        deaf: z.boolean(),
        self_mute: z.boolean(),
        self_deaf: z.boolean(),
        suppress: z.boolean(),
      }),
      volume: z.number(),
    }),
  ),
  messages: z.array(
    z.object({
      id: z.string(),
      channel_id: z.string(),
      guild_id: z.union([z.string(), z.null()]).optional(),
      author: z
        .union([
          z.object({
            id: z.string(),
            username: z.string(),
            global_name: z.union([z.string(), z.null()]).optional(),
            discriminator: z.string(),
            avatar: z.union([z.string(), z.null()]).optional(),
            flags: z.number(),
            public_flags: z.number().optional(),
            bot: z.boolean(),
            avatar_decoration_data: z
              .union([
                z.object({
                  asset: z.string(),
                  sku_id: z.string().optional(),
                  expires_at: z.union([z.number(), z.null()]).optional(),
                }),
                z.null(),
              ])
              .optional(),
          }),
          z.null(),
        ])
        .optional(),
      member: z
        .union([
          z.object({
            nick: z.union([z.string(), z.null()]).optional(),
            roles: z.array(z.string()),
            joined_at: z.string(),
            deaf: z.boolean(),
            mute: z.boolean(),
          }),
          z.null(),
        ])
        .optional(),
      content: z.string(),
      timestamp: z.string(),
      edited_timestamp: z.union([z.string(), z.null()]).optional(),
      tts: z.boolean(),
      mention_everyone: z.boolean(),
      mentions: z.array(
        z.object({
          id: z.string(),
          username: z.string(),
          global_name: z.union([z.string(), z.null()]).optional(),
          discriminator: z.string(),
          avatar: z.union([z.string(), z.null()]).optional(),
          flags: z.number(),
          public_flags: z.number().optional(),
          bot: z.boolean(),
          avatar_decoration_data: z
            .union([
              z.object({
                asset: z.string(),
                sku_id: z.string().optional(),
                expires_at: z.union([z.number(), z.null()]).optional(),
              }),
              z.null(),
            ])
            .optional(),
        }),
      ),
      mention_roles: z.array(z.string()),
      mention_channels: z
        .array(z.object({id: z.string(), guild_id: z.string(), type: z.number(), name: z.string()}))
        .optional(),
      attachments: z.array(
        z.object({
          id: z.string(),
          filename: z.string(),
          size: z.number(),
          url: z.string(),
          proxy_url: z.string(),
          height: z.union([z.number(), z.null()]).optional(),
          width: z.union([z.number(), z.null()]).optional(),
        }),
      ),
      embeds: z.array(
        z.object({
          title: z.union([z.string(), z.null()]).optional(),
          type: z.union([z.string(), z.null()]).optional(),
          description: z.union([z.string(), z.null()]).optional(),
          url: z.union([z.string(), z.null()]).optional(),
          timestamp: z.union([z.string(), z.null()]).optional(),
          color: z.union([z.number(), z.null()]).optional(),
          footer: z
            .union([
              z.object({
                text: z.string(),
                icon_url: z.union([z.string(), z.null()]).optional(),
                proxy_icon_url: z.union([z.string(), z.null()]).optional(),
              }),
              z.null(),
            ])
            .optional(),
          image: z
            .union([
              z.object({
                url: z.union([z.string(), z.null()]).optional(),
                proxy_url: z.union([z.string(), z.null()]).optional(),
                height: z.union([z.number(), z.null()]).optional(),
                width: z.union([z.number(), z.null()]).optional(),
              }),
              z.null(),
            ])
            .optional(),
          thumbnail: z
            .union([
              z.object({
                url: z.union([z.string(), z.null()]).optional(),
                proxy_url: z.union([z.string(), z.null()]).optional(),
                height: z.union([z.number(), z.null()]).optional(),
                width: z.union([z.number(), z.null()]).optional(),
              }),
              z.null(),
            ])
            .optional(),
          video: z
            .union([
              z.object({
                url: z.union([z.string(), z.null()]).optional(),
                proxy_url: z.union([z.string(), z.null()]).optional(),
                height: z.union([z.number(), z.null()]).optional(),
                width: z.union([z.number(), z.null()]).optional(),
              }),
              z.null(),
            ])
            .optional(),
          provider: z
            .union([
              z.object({
                name: z.union([z.string(), z.null()]).optional(),
                url: z.union([z.string(), z.null()]).optional(),
              }),
              z.null(),
            ])
            .optional(),
          author: z
            .union([
              z.object({
                name: z.union([z.string(), z.null()]).optional(),
                url: z.union([z.string(), z.null()]).optional(),
                icon_url: z.union([z.string(), z.null()]).optional(),
                proxy_icon_url: z.union([z.string(), z.null()]).optional(),
              }),
              z.null(),
            ])
            .optional(),
          fields: z
            .union([
              z.array(
                z.object({name: z.string(), value: z.string(), inline: z.union([z.boolean(), z.null()]).optional()}),
              ),
              z.null(),
            ])
            .optional(),
        }),
      ),
      components: z.array(z.object({type: z.number()}).catchall(z.any())).optional(),
      reactions: z
        .union([
          z.array(
            z.object({
              count: z.number(),
              me: z.boolean(),
              emoji: z.object({
                id: z.union([z.string(), z.null()]),
                name: z.union([z.string(), z.null()]),
                animated: z.union([z.boolean(), z.null()]).optional(),
              }),
            }),
          ),
          z.null(),
        ])
        .optional(),
      nonce: z.union([z.string(), z.number(), z.literal(null)]).optional(),
      pinned: z.boolean(),
      webhook_id: z.union([z.string(), z.null()]).optional(),
      type: z.number(),
      activity: z
        .union([z.object({type: z.number(), party_id: z.union([z.string(), z.null()]).optional()}), z.null()])
        .optional(),
      application: z
        .union([
          z.object({
            id: z.string(),
            cover_image: z.union([z.string(), z.null()]).optional(),
            description: z.string(),
            icon: z.union([z.string(), z.null()]).optional(),
            name: z.string(),
          }),
          z.null(),
        ])
        .optional(),
      message_reference: z
        .union([
          z.object({
            message_id: z.union([z.string(), z.null()]).optional(),
            channel_id: z.union([z.string(), z.null()]).optional(),
            guild_id: z.union([z.string(), z.null()]).optional(),
          }),
          z.null(),
        ])
        .optional(),
      flags: z.union([z.number(), z.null()]).optional(),
      application_id: z.string().optional(),
      sticker_items: z.array(z.object({id: z.string(), name: z.string(), format_type: z.number()})).optional(),
      poll: z
        .object({
          question: z.object({
            text: z.string().optional(),
            emoji: z
              .object({
                id: z.union([z.string(), z.null()]).optional(),
                name: z.union([z.string(), z.null()]).optional(),
                animated: z.union([z.boolean(), z.null()]).optional(),
              })
              .optional(),
          }),
          answers: z.array(
            z.object({
              answer_id: z.number(),
              poll_media: z.object({
                text: z.string().optional(),
                emoji: z
                  .object({
                    id: z.union([z.string(), z.null()]).optional(),
                    name: z.union([z.string(), z.null()]).optional(),
                    animated: z.union([z.boolean(), z.null()]).optional(),
                  })
                  .optional(),
              }),
            }),
          ),
          expiry: z.string(),
          allow_multiselect: z.boolean(),
          layout_type: z.number(),
          results: z
            .object({
              is_finalized: z.boolean(),
              answer_counts: z.array(z.object({id: z.number(), count: z.number(), me_voted: z.boolean()})),
            })
            .optional(),
        })
        .optional(),
      interaction_metadata: z
        .object({
          id: z.string(),
          type: z.number(),
          user: z
            .object({
              id: z.string(),
              username: z.string(),
              global_name: z.union([z.string(), z.null()]).optional(),
              discriminator: z.string(),
              avatar: z.union([z.string(), z.null()]).optional(),
              flags: z.number(),
              public_flags: z.number().optional(),
              bot: z.boolean(),
              avatar_decoration_data: z
                .union([
                  z.object({
                    asset: z.string(),
                    sku_id: z.string().optional(),
                    expires_at: z.union([z.number(), z.null()]).optional(),
                  }),
                  z.null(),
                ])
                .optional(),
            })
            .optional(),
          authorizing_integration_owners: z.object({'0': z.string().optional(), '1': z.string().optional()}),
          original_response_message_id: z.string().optional(),
          target_user: z
            .object({
              id: z.string(),
              username: z.string(),
              global_name: z.union([z.string(), z.null()]).optional(),
              discriminator: z.string(),
              avatar: z.union([z.string(), z.null()]).optional(),
              flags: z.number(),
              public_flags: z.number().optional(),
              bot: z.boolean(),
              avatar_decoration_data: z
                .union([
                  z.object({
                    asset: z.string(),
                    sku_id: z.string().optional(),
                    expires_at: z.union([z.number(), z.null()]).optional(),
                  }),
                  z.null(),
                ])
                .optional(),
            })
            .optional(),
          target_message_id: z.string().optional(),
          interacted_message_id: z.string().optional(),
          triggering_interaction_metadata: z
            .object({
              id: z.string(),
              type: z.number(),
              user: z
                .object({
                  id: z.string(),
                  username: z.string(),
                  global_name: z.union([z.string(), z.null()]).optional(),
                  discriminator: z.string(),
                  avatar: z.union([z.string(), z.null()]).optional(),
                  flags: z.number(),
                  public_flags: z.number().optional(),
                  bot: z.boolean(),
                  avatar_decoration_data: z
                    .union([
                      z.object({
                        asset: z.string(),
                        sku_id: z.string().optional(),
                        expires_at: z.union([z.number(), z.null()]).optional(),
                      }),
                      z.null(),
                    ])
                    .optional(),
                })
                .optional(),
              authorizing_integration_owners: z.object({'0': z.string().optional(), '1': z.string().optional()}),
              original_response_message_id: z.string().optional(),
              target_user: z
                .object({
                  id: z.string(),
                  username: z.string(),
                  global_name: z.union([z.string(), z.null()]).optional(),
                  discriminator: z.string(),
                  avatar: z.union([z.string(), z.null()]).optional(),
                  flags: z.number(),
                  public_flags: z.number().optional(),
                  bot: z.boolean(),
                  avatar_decoration_data: z
                    .union([
                      z.object({
                        asset: z.string(),
                        sku_id: z.string().optional(),
                        expires_at: z.union([z.number(), z.null()]).optional(),
                      }),
                      z.null(),
                    ])
                    .optional(),
                })
                .optional(),
              target_message_id: z.string().optional(),
              interacted_message_id: z.string().optional(),
            })
            .optional(),
        })
        .optional(),
      role_subscription_data: z
        .object({
          role_subscription_listing_id: z.string(),
          tier_name: z.string(),
          total_months_subscribed: z.number(),
          is_renewal: z.boolean(),
        })
        .optional(),
      blocked: z.boolean().optional(),
      nick: z.union([z.string(), z.null()]).optional(),
      author_color: z.union([z.string(), z.null()]).optional(),
    }),
  ),
});
export type GetChannelResponse = zInfer<typeof GetChannelResponseSchema>;

// GET_CHANNELS
export const GetChannelsRequestSchema = z.object({guild_id: z.union([z.string(), z.null()]).optional()});
export type GetChannelsRequest = zInfer<typeof GetChannelsRequestSchema>;
export const GetChannelsResponseSchema = z.object({
  channels: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: fallbackToDefault(
        z
          .union([
            z.literal(1),
            z.literal(3),
            z.literal(0),
            z.literal(2),
            z.literal(4),
            z.literal(5),
            z.literal(6),
            z.literal(10),
            z.literal(11),
            z.literal(12),
            z.literal(13),
            z.literal(14),
            z.literal(15),
            z.literal(16),
            z.literal(17),
            z.literal(18),
            z.literal(19),
            z.literal(20),
            z.literal(21),
            z.literal(10000),
          ])
          .or(z.literal(-1))
          .default(-1),
      ),
    }),
  ),
});
export type GetChannelsResponse = zInfer<typeof GetChannelsResponseSchema>;

// GET_GUILD
export const GetGuildRequestSchema = z.object({guild_id: z.string(), timeout: z.number().gte(0).lte(60).optional()});
export type GetGuildRequest = zInfer<typeof GetGuildRequestSchema>;
export const GetGuildResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon_url: z.union([z.string(), z.null()]),
  vanity_url_code: z.union([z.string(), z.null()]).optional(),
});
export type GetGuildResponse = zInfer<typeof GetGuildResponseSchema>;

// GET_ROLES
export const GetRolesRequestSchema = z.object({guild_id: z.string()});
export type GetRolesRequest = zInfer<typeof GetRolesRequestSchema>;
export const GetRolesResponseSchema = z.object({
  roles: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      color: z.number(),
      colors: z.object({
        primary_color: z.number(),
        secondary_color: z.union([z.number(), z.null()]),
        tertiary_color: z.union([z.number(), z.null()]),
      }),
      hoist: z.boolean(),
      position: z.number(),
      permissions: z.bigint().or(z.string()),
      managed: z.boolean(),
      mentionable: z.boolean(),
      icon: z.union([z.string(), z.null()]),
      unicode_emoji: z.union([z.string(), z.null()]),
      tags: z.object({
        bot_id: z.string().optional(),
        integration_id: z.string().optional(),
        premium_subscriber: z.literal(null).optional(),
        subscription_listing_id: z.string().optional(),
        available_for_purchase: z.literal(null).optional(),
        guild_connections: z.literal(null).optional(),
      }),
      flags: z.number(),
    }),
  ),
});
export type GetRolesResponse = zInfer<typeof GetRolesResponseSchema>;

// GET_CURRENT_USER_GUILD_MEMBER
export const GetCurrentUserGuildMemberRequestSchema = z.object({guild_id: z.string()});
export type GetCurrentUserGuildMemberRequest = zInfer<typeof GetCurrentUserGuildMemberRequestSchema>;
export const GetCurrentUserGuildMemberResponseSchema = z.union([
  z.object({
    user_id: z.string(),
    guild_id: z.string(),
    nick: z.union([z.string(), z.null()]),
    avatar: z.union([z.string(), z.null()]),
    avatar_decoration_data: z.union([
      z.object({
        asset: z.string(),
        sku_id: z.string().optional(),
        expires_at: z.union([z.number(), z.null()]).optional(),
      }),
      z.null(),
    ]),
    banner: z.union([z.string(), z.null()]),
    roles: z.array(z.string()),
    joined_at: z.union([z.string(), z.null()]),
    premium_since: z.union([z.string(), z.null()]),
    communication_disabled_until: z.union([z.string(), z.null()]),
    pending: z.boolean(),
    flags: z.number(),
    color_string: z.union([z.string(), z.null()]).optional(),
  }),
  z.null(),
]);
export type GetCurrentUserGuildMemberResponse = zInfer<typeof GetCurrentUserGuildMemberResponseSchema>;

// GET_GUILD_MEMBER
export const GetGuildMemberRequestSchema = z.object({guild_id: z.string(), user_id: z.string()});
export type GetGuildMemberRequest = zInfer<typeof GetGuildMemberRequestSchema>;
export const GetGuildMemberResponseSchema = z.union([
  z.object({
    user_id: z.string(),
    guild_id: z.string(),
    nick: z.union([z.string(), z.null()]),
    avatar: z.union([z.string(), z.null()]),
    avatar_decoration_data: z.union([
      z.object({
        asset: z.string(),
        sku_id: z.string().optional(),
        expires_at: z.union([z.number(), z.null()]).optional(),
      }),
      z.null(),
    ]),
    banner: z.union([z.string(), z.null()]),
    roles: z.array(z.string()),
    joined_at: z.union([z.string(), z.null()]),
    premium_since: z.union([z.string(), z.null()]),
    communication_disabled_until: z.union([z.string(), z.null()]),
    pending: z.boolean(),
    flags: z.number(),
    color_string: z.union([z.string(), z.null()]).optional(),
  }),
  z.null(),
]);
export type GetGuildMemberResponse = zInfer<typeof GetGuildMemberResponseSchema>;

// AUTHORIZE
export const AuthorizeRequestSchema = z.object({
  client_id: z.string().optional(),
  scope: z.union([z.string(), z.array(z.string())]).optional(),
  scopes: z.union([z.string(), z.array(z.string())]).optional(),
  response_type: z.string().optional(),
  code_challenge: z.string().optional(),
  code_challenge_method: z.string().optional(),
  state: z.string().optional(),
  prompt: z.string().optional(),
  nonce: z.string().optional(),
});
export type AuthorizeRequest = zInfer<typeof AuthorizeRequestSchema>;
export const AuthorizeResponseSchema = z.object({code: z.string()});
export type AuthorizeResponse = zInfer<typeof AuthorizeResponseSchema>;

// SET_ACTIVITY
export const SetActivityRequestSchema = z.object({
  pid: z.number().gte(0).optional(),
  activity: z
    .union([
      z
        .object({
          name: z.string().min(1).max(128).optional(),
          state: z.string().min(2).max(128).optional(),
          state_url: z.string().url().min(1).max(256).optional(),
          details: z.string().min(2).max(128).optional(),
          details_url: z.string().url().min(1).max(256).optional(),
          timestamps: z
            .object({start: z.number().gte(1).optional(), end: z.number().gte(1).optional()})
            .catchall(z.any())
            .optional(),
          assets: z
            .object({
              large_image: z.string().min(1).max(300).optional(),
              large_text: z.string().min(2).max(128).optional(),
              large_url: z.string().url().min(1).max(256).optional(),
              small_image: z.string().min(1).max(300).optional(),
              small_text: z.string().min(2).max(128).optional(),
              small_url: z.string().url().min(1).max(256).optional(),
              invite_cover_image: z.string().min(1).max(300).optional(),
            })
            .catchall(z.any())
            .optional(),
          party: z
            .object({
              id: z.string().min(2).max(128).optional(),
              size: z.array(z.number().gte(0)).min(2).max(2).optional(),
              privacy: fallbackToDefault(
                z
                  .union([z.literal(0), z.literal(1)])
                  .or(z.literal(-1))
                  .default(-1),
              ).default(0),
            })
            .catchall(z.any())
            .optional(),
          secrets: z
            .object({
              match: z.string().min(2).max(128).optional(),
              join: z.string().min(2).max(128).optional(),
              spectate: z.string().min(2).max(128).optional(),
            })
            .catchall(z.any())
            .optional(),
          buttons: z
            .array(
              z.object({label: z.string().min(1).max(32), url: z.string().url().min(1).max(512)}).catchall(z.any()),
            )
            .min(1)
            .max(2)
            .optional(),
          instance: z.boolean().optional(),
          supported_platforms: z
            .array(
              fallbackToDefault(
                z
                  .enum(['xbox', 'desktop', 'samsung', 'ios', 'android', 'ps4', 'ps5', 'embedded', 'meta_quest'])
                  .or(z.literal(-1))
                  .default(-1),
              ),
            )
            .min(1)
            .max(10)
            .optional(),
          type: fallbackToDefault(
            z
              .union([z.literal(0), z.literal(2), z.literal(3), z.literal(5)])
              .or(z.literal(-1))
              .default(-1),
          ).default(0),
          status_display_type: fallbackToDefault(
            z
              .union([z.literal(0), z.literal(1), z.literal(2)])
              .or(z.literal(-1))
              .default(-1),
          ).optional(),
        })
        .catchall(z.any()),
      z.null(),
    ])
    .optional(),
});
export type SetActivityRequest = zInfer<typeof SetActivityRequestSchema>;
export const SetActivityResponseSchema = z.union([
  z.object({
    session_id: z.string().optional(),
    name: z.string(),
    url: z.union([z.string(), z.null()]).optional(),
    application_id: z.string().optional(),
    status_display_type: z.number().optional(),
    state: z.string().optional(),
    state_url: z.string().optional(),
    details: z.string().optional(),
    details_url: z.string().optional(),
    emoji: z
      .union([
        z.object({
          name: z.string(),
          id: z.union([z.string(), z.null()]).optional(),
          animated: z.union([z.boolean(), z.null()]).optional(),
        }),
        z.null(),
      ])
      .optional(),
    assets: z
      .object({
        large_image: z.string().optional(),
        large_text: z.string().optional(),
        large_url: z.string().optional(),
        small_image: z.string().optional(),
        small_text: z.string().optional(),
        small_url: z.string().optional(),
      })
      .optional(),
    timestamps: z.object({start: z.number().optional(), end: z.number().optional()}).optional(),
    party: z
      .object({
        id: z.string().optional(),
        size: z.array(z.number()).min(2).max(2).optional(),
        privacy: z.number().optional(),
      })
      .optional(),
    secrets: z.object({match: z.string().optional(), join: z.string().optional()}).optional(),
    sync_id: z.string().optional(),
    created_at: z.number().optional(),
    instance: z.boolean().optional(),
    flags: z.number().optional(),
    metadata: z.object({button_urls: z.array(z.string()).optional()}).optional(),
    platform: z.string().optional(),
    supported_platforms: z.array(z.string()).optional(),
    buttons: z.array(z.string()).optional(),
    type: z.number(),
  }),
  z.null(),
]);
export type SetActivityResponse = zInfer<typeof SetActivityResponseSchema>;

// VOICE_STATE_UPDATE
export const VoiceStateUpdateSubscribeArgsSchema = z.object({channel_id: z.string()});
export type VoiceStateUpdateSubscribeArgs = zInfer<typeof VoiceStateUpdateSubscribeArgsSchema>;
export const VoiceStateUpdatePayloadSchema = z.object({
  nick: z.string(),
  mute: z.boolean(),
  volume: z.number(),
  pan: z.object({left: z.number(), right: z.number()}),
  voice_state: z.object({
    mute: z.boolean(),
    deaf: z.boolean(),
    self_mute: z.boolean(),
    self_deaf: z.boolean(),
    suppress: z.boolean(),
  }),
  user: z.object({
    id: z.string(),
    username: z.string(),
    global_name: z.union([z.string(), z.null()]).optional(),
    discriminator: z.string(),
    avatar: z.union([z.string(), z.null()]).optional(),
    flags: z.number(),
    public_flags: z.number().optional(),
    bot: z.boolean(),
    avatar_decoration_data: z
      .union([
        z.object({
          asset: z.string(),
          sku_id: z.string().optional(),
          expires_at: z.union([z.number(), z.null()]).optional(),
        }),
        z.null(),
      ])
      .optional(),
  }),
  channel_id: z.string().optional(),
});
export type VoiceStateUpdatePayload = zInfer<typeof VoiceStateUpdatePayloadSchema>;

// SPEAKING_START
export const SpeakingStartSubscribeArgsSchema = z.object({channel_id: z.union([z.string(), z.null()]).optional()});
export type SpeakingStartSubscribeArgs = zInfer<typeof SpeakingStartSubscribeArgsSchema>;
export const SpeakingStartPayloadSchema = z.object({
  channel_id: z.union([z.string(), z.null()]).optional(),
  user_id: z.string(),
});
export type SpeakingStartPayload = zInfer<typeof SpeakingStartPayloadSchema>;

// SPEAKING_STOP
export const SpeakingStopSubscribeArgsSchema = z.object({channel_id: z.union([z.string(), z.null()]).optional()});
export type SpeakingStopSubscribeArgs = zInfer<typeof SpeakingStopSubscribeArgsSchema>;
export const SpeakingStopPayloadSchema = z.object({
  channel_id: z.union([z.string(), z.null()]).optional(),
  user_id: z.string(),
});
export type SpeakingStopPayload = zInfer<typeof SpeakingStopPayloadSchema>;

// ACTIVITY_LAYOUT_MODE_UPDATE
export const ActivityLayoutModeUpdatePayloadSchema = z.object({
  layout_mode: fallbackToDefault(
    z
      .union([z.literal(0), z.literal(1), z.literal(2)])
      .or(z.literal(-1))
      .default(-1),
  ),
});
export type ActivityLayoutModeUpdatePayload = zInfer<typeof ActivityLayoutModeUpdatePayloadSchema>;

// CURRENT_USER_UPDATE
export const CurrentUserUpdatePayloadSchema = z.object({
  id: z.string(),
  username: z.string(),
  global_name: z.union([z.string(), z.null()]).optional(),
  discriminator: z.string(),
  avatar: z.union([z.string(), z.null()]).optional(),
  flags: z.number(),
  public_flags: z.number().optional(),
  bot: z.boolean(),
  avatar_decoration_data: z
    .union([
      z.object({
        asset: z.string(),
        sku_id: z.string().optional(),
        expires_at: z.union([z.number(), z.null()]).optional(),
      }),
      z.null(),
    ])
    .optional(),
});
export type CurrentUserUpdatePayload = zInfer<typeof CurrentUserUpdatePayloadSchema>;

// CURRENT_GUILD_MEMBER_UPDATE
export const CurrentGuildMemberUpdateSubscribeArgsSchema = z.object({guild_id: z.string()});
export type CurrentGuildMemberUpdateSubscribeArgs = zInfer<typeof CurrentGuildMemberUpdateSubscribeArgsSchema>;
export const CurrentGuildMemberUpdatePayloadSchema = z.object({
  user_id: z.string(),
  guild_id: z.string(),
  nick: z.union([z.string(), z.null()]).optional(),
  avatar: z.union([z.string(), z.null()]).optional(),
  avatar_decoration_data: z.union([
    z.object({
      asset: z.string(),
      sku_id: z.string().optional(),
      expires_at: z.union([z.number(), z.null()]).optional(),
    }),
    z.null(),
  ]),
  banner: z.union([z.string(), z.null()]).optional(),
  roles: z.array(z.string()).optional(),
  joined_at: z.union([z.string(), z.null()]).optional(),
  premium_since: z.union([z.string(), z.null()]).optional(),
  communication_disabled_until: z.union([z.string(), z.null()]).optional(),
  pending: z.boolean().optional(),
  flags: z.number().optional(),
  color_string: z.union([z.string(), z.null()]).optional(),
});
export type CurrentGuildMemberUpdatePayload = zInfer<typeof CurrentGuildMemberUpdatePayloadSchema>;

// ENTITLEMENT_CREATE
export const EntitlementCreatePayloadSchema = z.object({
  entitlement: z.object({
    id: z.string(),
    sku_id: z.string(),
    application_id: z.string(),
    user_id: z.string(),
    gift_code_flags: z.number(),
    type: fallbackToDefault(
      z
        .union([
          z.literal(1),
          z.literal(2),
          z.literal(3),
          z.literal(4),
          z.literal(5),
          z.literal(6),
          z.literal(7),
          z.literal(8),
          z.literal(9),
          z.literal(10),
          z.literal(11),
          z.literal(12),
          z.literal(13),
          z.literal(14),
          z.literal(15),
          z.literal(16),
          z.literal(17),
        ])
        .or(z.literal(-1))
        .default(-1),
    ),
    gifter_user_id: z.union([z.string(), z.null()]).optional(),
    branches: z.union([z.array(z.string()), z.null()]).optional(),
    starts_at: z.union([z.string(), z.null()]).optional(),
    ends_at: z.union([z.string(), z.null()]).optional(),
    parent_id: z.union([z.string(), z.null()]).optional(),
    consumed: z.union([z.boolean(), z.null()]).optional(),
    deleted: z.union([z.boolean(), z.null()]).optional(),
    gift_code_batch_id: z.union([z.string(), z.null()]).optional(),
  }),
});
export type EntitlementCreatePayload = zInfer<typeof EntitlementCreatePayloadSchema>;

// THERMAL_STATE_UPDATE
export const ThermalStateUpdatePayloadSchema = z.object({
  thermal_state: fallbackToDefault(
    z
      .union([z.literal(-1), z.literal(0), z.literal(1), z.literal(2), z.literal(3)])
      .or(z.literal(-1))
      .default(-1),
  ),
});
export type ThermalStateUpdatePayload = zInfer<typeof ThermalStateUpdatePayloadSchema>;

// ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE
export const ActivityInstanceParticipantsUpdatePayloadSchema = z.object({
  participants: z.array(
    z.object({
      id: z.string(),
      username: z.string(),
      global_name: z.union([z.string(), z.null()]).optional(),
      discriminator: z.string(),
      avatar: z.union([z.string(), z.null()]).optional(),
      flags: z.number(),
      public_flags: z.number().optional(),
      bot: z.boolean(),
      avatar_decoration_data: z
        .union([
          z.object({
            asset: z.string(),
            sku_id: z.string().optional(),
            expires_at: z.union([z.number(), z.null()]).optional(),
          }),
          z.null(),
        ])
        .optional(),
      nickname: z.string().optional(),
    }),
  ),
});
export type ActivityInstanceParticipantsUpdatePayload = zInfer<typeof ActivityInstanceParticipantsUpdatePayloadSchema>;

// RELATIONSHIP_UPDATE
export const RelationshipUpdatePayloadSchema = z.object({
  type: z.number(),
  user: z.object({
    id: z.string(),
    username: z.string(),
    global_name: z.union([z.string(), z.null()]).optional(),
    discriminator: z.string(),
    avatar: z.union([z.string(), z.null()]).optional(),
    flags: z.number(),
    public_flags: z.number().optional(),
    bot: z.boolean(),
    avatar_decoration_data: z
      .union([
        z.object({
          asset: z.string(),
          sku_id: z.string().optional(),
          expires_at: z.union([z.number(), z.null()]).optional(),
        }),
        z.null(),
      ])
      .optional(),
  }),
  presence: z
    .object({
      status: z.string(),
      activity: z
        .union([
          z.object({
            session_id: z.string().optional(),
            type: z.number().optional(),
            name: z.string(),
            url: z.union([z.string(), z.null()]).optional(),
            application_id: z.string().optional(),
            status_display_type: z.number().optional(),
            state: z.string().optional(),
            state_url: z.string().optional(),
            details: z.string().optional(),
            details_url: z.string().optional(),
            emoji: z
              .union([
                z.object({
                  name: z.string(),
                  id: z.union([z.string(), z.null()]).optional(),
                  animated: z.union([z.boolean(), z.null()]).optional(),
                }),
                z.null(),
              ])
              .optional(),
            assets: z
              .object({
                large_image: z.string().optional(),
                large_text: z.string().optional(),
                large_url: z.string().optional(),
                small_image: z.string().optional(),
                small_text: z.string().optional(),
                small_url: z.string().optional(),
              })
              .optional(),
            timestamps: z.object({start: z.number().optional(), end: z.number().optional()}).optional(),
            party: z
              .object({
                id: z.string().optional(),
                size: z.array(z.number()).min(2).max(2).optional(),
                privacy: z.number().optional(),
              })
              .optional(),
            secrets: z.object({match: z.string().optional(), join: z.string().optional()}).optional(),
            sync_id: z.string().optional(),
            created_at: z.number().optional(),
            instance: z.boolean().optional(),
            flags: z.number().optional(),
            metadata: z.object({button_urls: z.array(z.string()).optional()}).optional(),
            platform: z.string().optional(),
            supported_platforms: z.array(z.string()).optional(),
            buttons: z.array(z.string()).optional(),
          }),
          z.null(),
        ])
        .optional(),
    })
    .optional(),
});
export type RelationshipUpdatePayload = zInfer<typeof RelationshipUpdatePayloadSchema>;

// ACTIVITY_JOIN
export const ActivityJoinPayloadSchema = z.object({
  application_id: z.string(),
  secret: z.string(),
  intent: fallbackToDefault(
    z
      .union([z.literal(0), z.literal(1)])
      .or(z.literal(-1))
      .default(-1),
  ).optional(),
});
export type ActivityJoinPayload = zInfer<typeof ActivityJoinPayloadSchema>;

// QUEST_ENROLLMENT_STATUS_UPDATE
export const QuestEnrollmentStatusUpdateSubscribeArgsSchema = z.object({quest_id: z.string()});
export type QuestEnrollmentStatusUpdateSubscribeArgs = zInfer<typeof QuestEnrollmentStatusUpdateSubscribeArgsSchema>;
export const QuestEnrollmentStatusUpdatePayloadSchema = z.object({
  quest_id: z.string(),
  is_enrolled: z.boolean(),
  enrolled_at: z.union([z.string(), z.null()]).optional(),
});
export type QuestEnrollmentStatusUpdatePayload = zInfer<typeof QuestEnrollmentStatusUpdatePayloadSchema>;

/**
 * RPC Commands which support schemas.
 */
export enum Command {
  INITIATE_IMAGE_UPLOAD = 'INITIATE_IMAGE_UPLOAD',
  OPEN_SHARE_MOMENT_DIALOG = 'OPEN_SHARE_MOMENT_DIALOG',
  AUTHENTICATE = 'AUTHENTICATE',
  GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS = 'GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS',
  SHARE_LINK = 'SHARE_LINK',
  OPEN_USER_PROFILE = 'OPEN_USER_PROFILE',
  GET_RELATIONSHIPS = 'GET_RELATIONSHIPS',
  INVITE_USER_EMBEDDED = 'INVITE_USER_EMBEDDED',
  GET_CONTEXT = 'GET_CONTEXT',
  GET_USER = 'GET_USER',
  GET_CURRENT_USER = 'GET_CURRENT_USER',
  GET_QUEST_ENROLLMENT_STATUS = 'GET_QUEST_ENROLLMENT_STATUS',
  QUEST_START_TIMER = 'QUEST_START_TIMER',
  GET_QUEST = 'GET_QUEST',
  REQUEST_PROXY_TICKET_REFRESH = 'REQUEST_PROXY_TICKET_REFRESH',
  CAPTURE_LOG = 'CAPTURE_LOG',
  ENCOURAGE_HW_ACCELERATION = 'ENCOURAGE_HW_ACCELERATION',
  GET_PLATFORM_BEHAVIORS = 'GET_PLATFORM_BEHAVIORS',
  USER_SETTINGS_GET_LOCALE = 'USER_SETTINGS_GET_LOCALE',
  SET_ORIENTATION_LOCK_STATE = 'SET_ORIENTATION_LOCK_STATE',
  SET_CONFIG = 'SET_CONFIG',
  OPEN_INVITE_DIALOG = 'OPEN_INVITE_DIALOG',
  OPEN_EXTERNAL_LINK = 'OPEN_EXTERNAL_LINK',
  GET_CHANNEL_PERMISSIONS = 'GET_CHANNEL_PERMISSIONS',
  GET_SKUS_EMBEDDED = 'GET_SKUS_EMBEDDED',
  GET_ENTITLEMENTS_EMBEDDED = 'GET_ENTITLEMENTS_EMBEDDED',
  START_PURCHASE = 'START_PURCHASE',
  GET_CHANNEL = 'GET_CHANNEL',
  GET_CHANNELS = 'GET_CHANNELS',
  GET_GUILD = 'GET_GUILD',
  GET_ROLES = 'GET_ROLES',
  GET_CURRENT_USER_GUILD_MEMBER = 'GET_CURRENT_USER_GUILD_MEMBER',
  GET_GUILD_MEMBER = 'GET_GUILD_MEMBER',
  AUTHORIZE = 'AUTHORIZE',
  SET_ACTIVITY = 'SET_ACTIVITY',
}

const emptyResponseSchema = z.object({}).optional().nullable();
const emptyRequestSchema = z.void();

/**
 * Request & Response schemas for each supported RPC Command.
 */
export const Schemas = {
  [Command.INITIATE_IMAGE_UPLOAD]: {
    request: emptyRequestSchema,
    response: InitiateImageUploadResponseSchema,
  },
  [Command.OPEN_SHARE_MOMENT_DIALOG]: {
    request: OpenShareMomentDialogRequestSchema,
    response: emptyResponseSchema,
  },
  [Command.AUTHENTICATE]: {
    request: AuthenticateRequestSchema,
    response: AuthenticateResponseSchema,
  },
  [Command.GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS]: {
    request: emptyRequestSchema,
    response: GetActivityInstanceConnectedParticipantsResponseSchema,
  },
  [Command.SHARE_LINK]: {
    request: ShareLinkRequestSchema,
    response: ShareLinkResponseSchema,
  },
  [Command.OPEN_USER_PROFILE]: {
    request: OpenUserProfileRequestSchema,
    response: OpenUserProfileResponseSchema,
  },
  [Command.GET_RELATIONSHIPS]: {
    request: emptyRequestSchema,
    response: GetRelationshipsResponseSchema,
  },
  [Command.INVITE_USER_EMBEDDED]: {
    request: InviteUserEmbeddedRequestSchema,
    response: emptyResponseSchema,
  },
  [Command.GET_CONTEXT]: {
    request: emptyRequestSchema,
    response: GetContextResponseSchema,
  },
  [Command.GET_USER]: {
    request: GetUserRequestSchema,
    response: GetUserResponseSchema,
  },
  [Command.GET_CURRENT_USER]: {
    request: emptyRequestSchema,
    response: GetCurrentUserResponseSchema,
  },
  [Command.GET_QUEST_ENROLLMENT_STATUS]: {
    request: GetQuestEnrollmentStatusRequestSchema,
    response: GetQuestEnrollmentStatusResponseSchema,
  },
  [Command.QUEST_START_TIMER]: {
    request: QuestStartTimerRequestSchema,
    response: QuestStartTimerResponseSchema,
  },
  [Command.GET_QUEST]: {
    request: emptyRequestSchema,
    response: GetQuestResponseSchema,
  },
  [Command.REQUEST_PROXY_TICKET_REFRESH]: {
    request: emptyRequestSchema,
    response: RequestProxyTicketRefreshResponseSchema,
  },
  [Command.CAPTURE_LOG]: {
    request: CaptureLogRequestSchema,
    response: emptyResponseSchema,
  },
  [Command.ENCOURAGE_HW_ACCELERATION]: {
    request: emptyRequestSchema,
    response: EncourageHwAccelerationResponseSchema,
  },
  [Command.GET_PLATFORM_BEHAVIORS]: {
    request: emptyRequestSchema,
    response: GetPlatformBehaviorsResponseSchema,
  },
  [Command.USER_SETTINGS_GET_LOCALE]: {
    request: emptyRequestSchema,
    response: UserSettingsGetLocaleResponseSchema,
  },
  [Command.SET_ORIENTATION_LOCK_STATE]: {
    request: SetOrientationLockStateRequestSchema,
    response: emptyResponseSchema,
  },
  [Command.SET_CONFIG]: {
    request: SetConfigRequestSchema,
    response: SetConfigResponseSchema,
  },
  [Command.OPEN_INVITE_DIALOG]: {
    request: emptyRequestSchema,
    response: emptyResponseSchema,
  },
  [Command.OPEN_EXTERNAL_LINK]: {
    request: OpenExternalLinkRequestSchema,
    response: OpenExternalLinkResponseSchema,
  },
  [Command.GET_CHANNEL_PERMISSIONS]: {
    request: emptyRequestSchema,
    response: GetChannelPermissionsResponseSchema,
  },
  [Command.GET_SKUS_EMBEDDED]: {
    request: emptyRequestSchema,
    response: GetSkusEmbeddedResponseSchema,
  },
  [Command.GET_ENTITLEMENTS_EMBEDDED]: {
    request: emptyRequestSchema,
    response: GetEntitlementsEmbeddedResponseSchema,
  },
  [Command.START_PURCHASE]: {
    request: StartPurchaseRequestSchema,
    response: StartPurchaseResponseSchema,
  },
  [Command.GET_CHANNEL]: {
    request: GetChannelRequestSchema,
    response: GetChannelResponseSchema,
  },
  [Command.GET_CHANNELS]: {
    request: GetChannelsRequestSchema,
    response: GetChannelsResponseSchema,
  },
  [Command.GET_GUILD]: {
    request: GetGuildRequestSchema,
    response: GetGuildResponseSchema,
  },
  [Command.GET_ROLES]: {
    request: GetRolesRequestSchema,
    response: GetRolesResponseSchema,
  },
  [Command.GET_CURRENT_USER_GUILD_MEMBER]: {
    request: GetCurrentUserGuildMemberRequestSchema,
    response: GetCurrentUserGuildMemberResponseSchema,
  },
  [Command.GET_GUILD_MEMBER]: {
    request: GetGuildMemberRequestSchema,
    response: GetGuildMemberResponseSchema,
  },
  [Command.AUTHORIZE]: {
    request: AuthorizeRequestSchema,
    response: AuthorizeResponseSchema,
  },
  [Command.SET_ACTIVITY]: {
    request: SetActivityRequestSchema,
    response: SetActivityResponseSchema,
  },
} as const;

/**
 * Subscribe args & payload schemas for each supported RPC Event.
 */
export const EventSchemas = {
  VOICE_STATE_UPDATE: {subscribeArgs: VoiceStateUpdateSubscribeArgsSchema, payload: VoiceStateUpdatePayloadSchema},
  SPEAKING_START: {subscribeArgs: SpeakingStartSubscribeArgsSchema, payload: SpeakingStartPayloadSchema},
  SPEAKING_STOP: {subscribeArgs: SpeakingStopSubscribeArgsSchema, payload: SpeakingStopPayloadSchema},
  ACTIVITY_LAYOUT_MODE_UPDATE: {payload: ActivityLayoutModeUpdatePayloadSchema},
  CURRENT_USER_UPDATE: {payload: CurrentUserUpdatePayloadSchema},
  CURRENT_GUILD_MEMBER_UPDATE: {
    subscribeArgs: CurrentGuildMemberUpdateSubscribeArgsSchema,
    payload: CurrentGuildMemberUpdatePayloadSchema,
  },
  ENTITLEMENT_CREATE: {payload: EntitlementCreatePayloadSchema},
  THERMAL_STATE_UPDATE: {payload: ThermalStateUpdatePayloadSchema},
  ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE: {payload: ActivityInstanceParticipantsUpdatePayloadSchema},
  RELATIONSHIP_UPDATE: {payload: RelationshipUpdatePayloadSchema},
  ACTIVITY_JOIN: {payload: ActivityJoinPayloadSchema},
  QUEST_ENROLLMENT_STATUS_UPDATE: {
    subscribeArgs: QuestEnrollmentStatusUpdateSubscribeArgsSchema,
    payload: QuestEnrollmentStatusUpdatePayloadSchema,
  },
} as const;
