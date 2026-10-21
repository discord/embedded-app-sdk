import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

/** Returns user data for the current user. */
export const getCurrentUser = schemaCommandFactory(Command.GET_CURRENT_USER);
