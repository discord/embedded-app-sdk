import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

export const shareInteraction = schemaCommandFactory(Command.SHARE_INTERACTION);
