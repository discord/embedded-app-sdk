import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

/**
 * Returns the roles in the provided guild id.
 * Must be the current guild, and the app's bot must be installed in it.
 */
export const getRoles = schemaCommandFactory(Command.GET_ROLES);
