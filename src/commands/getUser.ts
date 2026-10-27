import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

/** Returns user data for the provided user id. */
export const getUser = schemaCommandFactory(Command.GET_USER);
