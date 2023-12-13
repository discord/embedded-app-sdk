import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

/**
 * Authenticate Activity
 */
export const authenticate = schemaCommandFactory(Command.AUTHENTICATE);
