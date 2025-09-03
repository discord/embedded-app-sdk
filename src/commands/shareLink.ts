import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

export const shareLink = schemaCommandFactory(Command.SHARE_LINK);
