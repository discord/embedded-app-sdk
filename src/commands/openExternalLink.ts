import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

/**
 *
 */
export const openExternalLink = schemaCommandFactory(Command.OPEN_EXTERNAL_LINK);
