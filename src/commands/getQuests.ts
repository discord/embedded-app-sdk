import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

export const getQuests = schemaCommandFactory(Command.GET_QUESTS);
