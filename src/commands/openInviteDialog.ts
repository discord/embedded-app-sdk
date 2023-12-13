import {Commands} from '../schema/common';
import {EmptyResponse} from '../schema/responses';
import {TSendCommand} from '../schema/types';
import {commandFactory} from '../utils/commandFactory';

/**
 * Opens the invite dialog within the discord client, allowing users to share invite links to friends.
 * Does not work in (G)DM contexts (throws RPCError.INVALID_CHANNEL), so should not be called if discordSdk.guildId == null
 * Similarly, if the user does not have Permissions.CREATE_INSTANT_INVITE this command throws RPCErrors.INVALID_PERMISSIONS, so checking the user's permissions via getChannelPermissions is highly recommended.
 */
export const openInviteDialog = (sendCommand: TSendCommand) =>
  commandFactory<void, typeof EmptyResponse>(sendCommand, Commands.OPEN_INVITE_DIALOG, EmptyResponse);
