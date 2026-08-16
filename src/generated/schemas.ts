/**
 * This file is generated.
 * Run "npm run sync" to regenerate file.
 * @generated
 */
import {z, infer as zInfer} from 'zod';
import {fallbackToDefault} from '../utils/zodUtils';

// INITIATE_IMAGE_UPLOAD
export const InitiateImageUploadResponseSchema = z
  .object({image_url: z.string()})
  .describe('Response for "INITIATE_IMAGE_UPLOAD" Command');
export type InitiateImageUploadResponse = zInfer<typeof InitiateImageUploadResponseSchema>;

// OPEN_SHARE_MOMENT_DIALOG
export const OpenShareMomentDialogRequestSchema = z
  .object({mediaUrl: z.string().max(1024)})
  .describe('Request for "OPEN_SHARE_MOMENT_DIALOG" Command');
export type OpenShareMomentDialogRequest = zInfer<typeof OpenShareMomentDialogRequestSchema>;

// AUTHENTICATE
export const AuthenticateRequestSchema = z
  .object({access_token: z.union([z.string(), z.null()]).optional()})
  .describe('Request for "AUTHENTICATE" Command');
export type AuthenticateRequest = zInfer<typeof AuthenticateRequestSchema>;
export const AuthenticateResponseSchema = z
  .object({
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
            'vibegrations.projects',
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
  })
  .describe('Response for "AUTHENTICATE" Command');
export type AuthenticateResponse = zInfer<typeof AuthenticateResponseSchema>;

// GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS
export const GetActivityInstanceConnectedParticipantsResponseSchema = z
  .object({
    participants: z.array(
      z.object({
        id: z.string(),
        username: z.string(),
        global_name: z.union([z.string(), z.null()]).optional(),
        discriminator: z.string(),
        avatar: z.union([z.string(), z.null()]).optional(),
        flags: z.number(),
        bot: z.boolean(),
        avatar_decoration_data: z
          .union([
            z.object({
              asset: z.union([z.string(), z.null()]).optional(),
              skuId: z.string().optional(),
              expiresAt: z.number().optional(),
            }),
            z.null(),
          ])
          .optional(),
        premium_type: z.union([z.number(), z.null()]).optional(),
        nickname: z.string().optional(),
      }),
    ),
  })
  .describe('Response for "GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS" Command');
export type GetActivityInstanceConnectedParticipantsResponse = zInfer<
  typeof GetActivityInstanceConnectedParticipantsResponseSchema
>;

// GET_SPATIAL_VOICE_CAPABILITIES
export const GetSpatialVoiceCapabilitiesResponseSchema = z.object({
  available: z.boolean(),
  source_positioning: z.boolean(),
  source_gain: z.boolean(),
  source_spatial_blend: z.boolean(),
  listener_pose: z.boolean(),
  room_size: z.boolean(),
  reflections: z.boolean(),
  binary_speaking: z.boolean(),
  participant_updates: z.boolean(),
  max_sources: z.number().int(),
  max_updates_per_second: z.number().int(),
});
export type GetSpatialVoiceCapabilitiesResponse = zInfer<typeof GetSpatialVoiceCapabilitiesResponseSchema>;

// GET_SPATIAL_VOICE_PARTICIPANTS
export const GetSpatialVoiceParticipantsResponseSchema = z
  .object({
    participants: z.array(
      z.object({
        user_id: z.string(),
        username: z.string(),
        global_name: z.union([z.string(), z.null()]),
        avatar: z.union([z.string(), z.null()]),
        mute: z.boolean(),
        deaf: z.boolean(),
        self_mute: z.boolean(),
        self_deaf: z.boolean(),
        speaking: z.boolean(),
      }),
    ),
  })
  .describe('Response for "GET_SPATIAL_VOICE_PARTICIPANTS" Command');
export type GetSpatialVoiceParticipantsResponse = zInfer<typeof GetSpatialVoiceParticipantsResponseSchema>;

// START_SPATIAL_VOICE_SESSION
export const StartSpatialVoiceSessionResponseSchema = z
  .object({
    session_id: z.string(),
    channel_id: z.string(),
    capabilities: z.object({
      available: z.boolean(),
      source_positioning: z.boolean(),
      source_gain: z.boolean(),
      source_spatial_blend: z.boolean(),
      listener_pose: z.boolean(),
      room_size: z.boolean(),
      reflections: z.boolean(),
      binary_speaking: z.boolean(),
      participant_updates: z.boolean(),
      max_sources: z.number().int(),
      max_updates_per_second: z.number().int(),
    }),
    participants: z.array(
      z.object({
        user_id: z.string(),
        username: z.string(),
        global_name: z.union([z.string(), z.null()]),
        avatar: z.union([z.string(), z.null()]),
        mute: z.boolean(),
        deaf: z.boolean(),
        self_mute: z.boolean(),
        self_deaf: z.boolean(),
        speaking: z.boolean(),
      }),
    ),
  })
  .describe('Response for "START_SPATIAL_VOICE_SESSION" Command');
export type StartSpatialVoiceSessionResponse = zInfer<typeof StartSpatialVoiceSessionResponseSchema>;

// UPDATE_SPATIAL_VOICE_SESSION
export const UpdateSpatialVoiceSessionRequestSchema = z
  .object({
    session_id: z.string(),
    listener: z.object({
      position: z.object({
        x: z.number().gte(-100000).lte(100000),
        y: z.number().gte(-100000).lte(100000),
        z: z.number().gte(-100000).lte(100000),
      }),
      forward: z.object({
        x: z.number().gte(-100000).lte(100000),
        y: z.number().gte(-100000).lte(100000),
        z: z.number().gte(-100000).lte(100000),
      }),
    }),
    sources: z
      .array(
        z.object({
          user_id: z.string(),
          position: z.object({
            x: z.number().gte(-100000).lte(100000),
            y: z.number().gte(-100000).lte(100000),
            z: z.number().gte(-100000).lte(100000),
          }),
          gain: z.number().gte(0).lte(1),
          spatial_blend: z.number().gte(0).lte(1),
        }),
      )
      .max(50),
  })
  .describe('Request for "UPDATE_SPATIAL_VOICE_SESSION" Command');
export type UpdateSpatialVoiceSessionRequest = zInfer<typeof UpdateSpatialVoiceSessionRequestSchema>;
export const UpdateSpatialVoiceSessionResponseSchema = z
  .object({success: z.boolean()})
  .describe('Response for "UPDATE_SPATIAL_VOICE_SESSION" Command');
export type UpdateSpatialVoiceSessionResponse = zInfer<typeof UpdateSpatialVoiceSessionResponseSchema>;

// SUSPEND_SPATIAL_VOICE_SESSION
export const SuspendSpatialVoiceSessionRequestSchema = z
  .object({session_id: z.string()})
  .describe('Request for "SUSPEND_SPATIAL_VOICE_SESSION" Command');
export type SuspendSpatialVoiceSessionRequest = zInfer<typeof SuspendSpatialVoiceSessionRequestSchema>;
export const SuspendSpatialVoiceSessionResponseSchema = z
  .object({success: z.boolean()})
  .describe('Response for "SUSPEND_SPATIAL_VOICE_SESSION" Command');
export type SuspendSpatialVoiceSessionResponse = zInfer<typeof SuspendSpatialVoiceSessionResponseSchema>;

// RESUME_SPATIAL_VOICE_SESSION
export const ResumeSpatialVoiceSessionRequestSchema = z
  .object({session_id: z.string()})
  .describe('Request for "RESUME_SPATIAL_VOICE_SESSION" Command');
export type ResumeSpatialVoiceSessionRequest = zInfer<typeof ResumeSpatialVoiceSessionRequestSchema>;
export const ResumeSpatialVoiceSessionResponseSchema = z
  .object({success: z.boolean()})
  .describe('Response for "RESUME_SPATIAL_VOICE_SESSION" Command');
export type ResumeSpatialVoiceSessionResponse = zInfer<typeof ResumeSpatialVoiceSessionResponseSchema>;

// STOP_SPATIAL_VOICE_SESSION
export const StopSpatialVoiceSessionRequestSchema = z
  .object({session_id: z.string()})
  .describe('Request for "STOP_SPATIAL_VOICE_SESSION" Command');
export type StopSpatialVoiceSessionRequest = zInfer<typeof StopSpatialVoiceSessionRequestSchema>;
export const StopSpatialVoiceSessionResponseSchema = z
  .object({success: z.boolean()})
  .describe('Response for "STOP_SPATIAL_VOICE_SESSION" Command');
export type StopSpatialVoiceSessionResponse = zInfer<typeof StopSpatialVoiceSessionResponseSchema>;

// SHARE_INTERACTION
export const ShareInteractionRequestSchema = z
  .object({
    command: z.string(),
    options: z.array(z.object({name: z.string(), value: z.string()})).optional(),
    content: z.string().max(2000).optional(),
    require_launch_channel: z.boolean().optional(),
    preview_image: z.object({height: z.number(), url: z.string(), width: z.number()}).optional(),
    components: z
      .array(
        z.object({
          type: z.literal(1),
          components: z
            .array(
              z.object({
                type: z.literal(2),
                style: z.number().gte(1).lte(5),
                label: z.string().max(80).optional(),
                custom_id: z
                  .string()
                  .max(100)
                  .describe('Developer-defined identifier for the button; max 100 characters')
                  .optional(),
              }),
            )
            .max(5)
            .optional(),
        }),
      )
      .optional(),
    pid: z.number().optional(),
  })
  .describe('Request for "SHARE_INTERACTION" Command');
export type ShareInteractionRequest = zInfer<typeof ShareInteractionRequestSchema>;
export const ShareInteractionResponseSchema = z
  .object({success: z.boolean()})
  .describe('Response for "SHARE_INTERACTION" Command');
export type ShareInteractionResponse = zInfer<typeof ShareInteractionResponseSchema>;

// SHARE_LINK
export const ShareLinkRequestSchema = z
  .object({
    custom_id: z.string().max(64).optional(),
    message: z.string().max(1000),
    link_id: z.string().max(64).optional(),
  })
  .describe('Request for "SHARE_LINK" Command');
export type ShareLinkRequest = zInfer<typeof ShareLinkRequestSchema>;
export const ShareLinkResponseSchema = z
  .object({success: z.boolean(), didCopyLink: z.boolean(), didSendMessage: z.boolean()})
  .describe('Response for "SHARE_LINK" Command');
export type ShareLinkResponse = zInfer<typeof ShareLinkResponseSchema>;

// GET_RELATIONSHIPS
export const GetRelationshipsResponseSchema = z
  .object({
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
          bot: z.boolean(),
          avatar_decoration_data: z
            .union([
              z.object({
                asset: z.union([z.string(), z.null()]).optional(),
                skuId: z.string().optional(),
                expiresAt: z.number().optional(),
              }),
              z.null(),
            ])
            .optional(),
          premium_type: z.union([z.number(), z.null()]).optional(),
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
                  metadata: z.object({}).optional(),
                  platform: z.string().optional(),
                  supported_platforms: z.array(z.string()).optional(),
                  buttons: z.array(z.string()).optional(),
                  hangStatus: z.string().optional(),
                }),
                z.null(),
              ])
              .optional(),
          })
          .optional(),
      }),
    ),
  })
  .describe('Response for "GET_RELATIONSHIPS" Command');
export type GetRelationshipsResponse = zInfer<typeof GetRelationshipsResponseSchema>;

// INVITE_USER_EMBEDDED
export const InviteUserEmbeddedRequestSchema = z
  .object({user_id: z.string(), content: z.string().min(0).max(1024).optional()})
  .describe('Request for "INVITE_USER_EMBEDDED" Command');
export type InviteUserEmbeddedRequest = zInfer<typeof InviteUserEmbeddedRequestSchema>;

// GET_USER
export const GetUserRequestSchema = z.object({id: z.string().max(64)}).describe('Request for "GET_USER" Command');
export type GetUserRequest = zInfer<typeof GetUserRequestSchema>;
export const GetUserResponseSchema = z.union([
  z.object({
    id: z.string(),
    username: z.string(),
    global_name: z.union([z.string(), z.null()]).optional(),
    discriminator: z.string(),
    avatar: z.union([z.string(), z.null()]).optional(),
    flags: z.number(),
    bot: z.boolean(),
    avatar_decoration_data: z
      .union([
        z.object({
          asset: z.union([z.string(), z.null()]).optional(),
          skuId: z.string().optional(),
          expiresAt: z.number().optional(),
        }),
        z.null(),
      ])
      .optional(),
    premium_type: z.union([z.number(), z.null()]).optional(),
  }),
  z.null(),
]);
export type GetUserResponse = zInfer<typeof GetUserResponseSchema>;

// GET_QUEST_ENROLLMENT_STATUS
export const GetQuestEnrollmentStatusRequestSchema = z
  .object({quest_id: z.string()})
  .describe('Request for "GET_QUEST_ENROLLMENT_STATUS" Command');
export type GetQuestEnrollmentStatusRequest = zInfer<typeof GetQuestEnrollmentStatusRequestSchema>;
export const GetQuestEnrollmentStatusResponseSchema = z
  .object({quest_id: z.string(), is_enrolled: z.boolean(), enrolled_at: z.union([z.string(), z.null()]).optional()})
  .describe('Response for "GET_QUEST_ENROLLMENT_STATUS" Command');
export type GetQuestEnrollmentStatusResponse = zInfer<typeof GetQuestEnrollmentStatusResponseSchema>;

// QUEST_START_TIMER
export const QuestStartTimerRequestSchema = z
  .object({quest_id: z.string()})
  .describe('Request for "QUEST_START_TIMER" Command');
export type QuestStartTimerRequest = zInfer<typeof QuestStartTimerRequestSchema>;
export const QuestStartTimerResponseSchema = z
  .object({success: z.boolean()})
  .describe('Response for "QUEST_START_TIMER" Command');
export type QuestStartTimerResponse = zInfer<typeof QuestStartTimerResponseSchema>;

// GET_QUEST
export const GetQuestResponseSchema = z
  .object({
    quest_id: z.string(),
    enrolled_at: z.union([z.string(), z.null()]).optional(),
    completed_at: z.union([z.string(), z.null()]).optional(),
    external_cta_url: z.string(),
  })
  .describe('Response for "GET_QUEST" Command');
export type GetQuestResponse = zInfer<typeof GetQuestResponseSchema>;

// REQUEST_PROXY_TICKET_REFRESH
export const RequestProxyTicketRefreshResponseSchema = z
  .object({ticket: z.string()})
  .describe('Response for "REQUEST_PROXY_TICKET_REFRESH" Command');
export type RequestProxyTicketRefreshResponse = zInfer<typeof RequestProxyTicketRefreshResponseSchema>;

/**
 * RPC Commands which support schemas.
 */
export enum Command {
  INITIATE_IMAGE_UPLOAD = 'INITIATE_IMAGE_UPLOAD',
  OPEN_SHARE_MOMENT_DIALOG = 'OPEN_SHARE_MOMENT_DIALOG',
  AUTHENTICATE = 'AUTHENTICATE',
  GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS = 'GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS',
  GET_SPATIAL_VOICE_CAPABILITIES = 'GET_SPATIAL_VOICE_CAPABILITIES',
  GET_SPATIAL_VOICE_PARTICIPANTS = 'GET_SPATIAL_VOICE_PARTICIPANTS',
  START_SPATIAL_VOICE_SESSION = 'START_SPATIAL_VOICE_SESSION',
  UPDATE_SPATIAL_VOICE_SESSION = 'UPDATE_SPATIAL_VOICE_SESSION',
  SUSPEND_SPATIAL_VOICE_SESSION = 'SUSPEND_SPATIAL_VOICE_SESSION',
  RESUME_SPATIAL_VOICE_SESSION = 'RESUME_SPATIAL_VOICE_SESSION',
  STOP_SPATIAL_VOICE_SESSION = 'STOP_SPATIAL_VOICE_SESSION',
  SHARE_INTERACTION = 'SHARE_INTERACTION',
  SHARE_LINK = 'SHARE_LINK',
  GET_RELATIONSHIPS = 'GET_RELATIONSHIPS',
  INVITE_USER_EMBEDDED = 'INVITE_USER_EMBEDDED',
  GET_USER = 'GET_USER',
  GET_QUEST_ENROLLMENT_STATUS = 'GET_QUEST_ENROLLMENT_STATUS',
  QUEST_START_TIMER = 'QUEST_START_TIMER',
  GET_QUEST = 'GET_QUEST',
  REQUEST_PROXY_TICKET_REFRESH = 'REQUEST_PROXY_TICKET_REFRESH',
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
  [Command.GET_SPATIAL_VOICE_CAPABILITIES]: {
    request: emptyRequestSchema,
    response: GetSpatialVoiceCapabilitiesResponseSchema,
  },
  [Command.GET_SPATIAL_VOICE_PARTICIPANTS]: {
    request: emptyRequestSchema,
    response: GetSpatialVoiceParticipantsResponseSchema,
  },
  [Command.START_SPATIAL_VOICE_SESSION]: {
    request: emptyRequestSchema,
    response: StartSpatialVoiceSessionResponseSchema,
  },
  [Command.UPDATE_SPATIAL_VOICE_SESSION]: {
    request: UpdateSpatialVoiceSessionRequestSchema,
    response: UpdateSpatialVoiceSessionResponseSchema,
  },
  [Command.SUSPEND_SPATIAL_VOICE_SESSION]: {
    request: SuspendSpatialVoiceSessionRequestSchema,
    response: SuspendSpatialVoiceSessionResponseSchema,
  },
  [Command.RESUME_SPATIAL_VOICE_SESSION]: {
    request: ResumeSpatialVoiceSessionRequestSchema,
    response: ResumeSpatialVoiceSessionResponseSchema,
  },
  [Command.STOP_SPATIAL_VOICE_SESSION]: {
    request: StopSpatialVoiceSessionRequestSchema,
    response: StopSpatialVoiceSessionResponseSchema,
  },
  [Command.SHARE_INTERACTION]: {
    request: ShareInteractionRequestSchema,
    response: ShareInteractionResponseSchema,
  },
  [Command.SHARE_LINK]: {
    request: ShareLinkRequestSchema,
    response: ShareLinkResponseSchema,
  },
  [Command.GET_RELATIONSHIPS]: {
    request: emptyRequestSchema,
    response: GetRelationshipsResponseSchema,
  },
  [Command.INVITE_USER_EMBEDDED]: {
    request: InviteUserEmbeddedRequestSchema,
    response: emptyResponseSchema,
  },
  [Command.GET_USER]: {
    request: GetUserRequestSchema,
    response: GetUserResponseSchema,
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
} as const;
