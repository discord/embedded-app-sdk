/**
 * This file is generated.
 * Run "pnpm sync" to regenerate file.
 * @generated
 */
import {z, infer as zInfer} from 'zod';
import {fallbackToDefault} from '../utils/zodUtils';

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
          'email',
          'connections',
          'guilds',
          'guilds.join',
          'guilds.members.read',
          'gdm.join',
          'rpc',
          'rpc.notifications.read',
          'rpc.voice.read',
          'rpc.voice.write',
          'rpc.video.read',
          'rpc.video.write',
          'rpc.screenshare.read',
          'rpc.screenshare.write',
          'rpc.activities.write',
          'bot',
          'webhook.incoming',
          'messages.read',
          'applications.builds.upload',
          'applications.builds.read',
          'applications.commands',
          'applications.commands.update',
          'applications.commands.permissions.update',
          'applications.store.update',
          'applications.entitlements',
          'activities.read',
          'activities.write',
          'relationships.read',
          'voice',
          'dm_channels.read',
          'role_connections.write',
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
      bot: z.boolean(),
      avatar_decoration_data: z
        .union([z.object({asset: z.string(), skuId: z.string().optional()}), z.null()])
        .optional(),
      premium_type: z.union([z.number(), z.null()]).optional(),
      nickname: z.string().optional(),
    }),
  ),
});
export type GetActivityInstanceConnectedParticipantsResponse = zInfer<
  typeof GetActivityInstanceConnectedParticipantsResponseSchema
>;

/**
 * RPC Commands which support schemas.
 */
export enum Command {
  INITIATE_IMAGE_UPLOAD = 'INITIATE_IMAGE_UPLOAD',
  OPEN_SHARE_MOMENT_DIALOG = 'OPEN_SHARE_MOMENT_DIALOG',
  AUTHENTICATE = 'AUTHENTICATE',
  GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS = 'GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS',
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
} as const;
