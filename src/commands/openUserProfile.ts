import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

/** Opens the user profile for the provided user id. */
export const openUserProfile = schemaCommandFactory(Command.OPEN_USER_PROFILE);
