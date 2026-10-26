import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

/** Returns the current user's guild member object for the guild id. */
export const getCurrentUserGuildMember = schemaCommandFactory(Command.GET_CURRENT_USER_GUILD_MEMBER);
