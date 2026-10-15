import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

/**
 * Returns the Permissions for the current user in the currently connected channel: a bigint on web where BigInt is supported, otherwise a decimal string (always on mobile). Use PermissionsUtils to calculate if a user has a particular permission.
 * Always returns no permissions (`0n`, or `'0'`) in a (G)DM context, so is unnecessary to call when discordSdk.guildId == null.
 */
export const getChannelPermissions = schemaCommandFactory(Command.GET_CHANNEL_PERMISSIONS);
