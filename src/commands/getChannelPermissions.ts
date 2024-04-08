import {Commands} from '../schema/common';
import {GetChannelPermissionsResponse} from '../schema/responses';
import {TSendCommand} from '../schema/types';
import {commandFactory} from '../utils/commandFactory';

/**
 * Returns a bigint representing Permissions for the current user in the currently connected channel. Use PermissionsUtils to calculate if a user has a particular permission.
 * Always returns `0n` (no valid permissions) in a (G)DM context, so is unnecessary to call when discordSdk.guildId == null.
 */
export const getChannelPermissions = (sendCommand: TSendCommand) =>
  commandFactory<void, typeof GetChannelPermissionsResponse>(
    sendCommand,
    Commands.GET_CHANNEL_PERMISSIONS,
    GetChannelPermissionsResponse,
  );
