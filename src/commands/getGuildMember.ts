import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

/**
 * Returns the guild member object for the provided guild id and user id.
 * Must be the current guild, and the app's bot must be installed in it.
 */
export const getGuildMember = schemaCommandFactory(Command.GET_GUILD_MEMBER);
