import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

/**
 *
 */
export const setConfig = schemaCommandFactory(Command.SET_CONFIG);
