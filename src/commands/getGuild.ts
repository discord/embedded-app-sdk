import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

/**
 * Returns guild data for the provided guild id.
 * Must be the current guild, and the app's bot must be installed in it.
 */
export const getGuild = schemaCommandFactory(Command.GET_GUILD);
