import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

export const getQuest = schemaCommandFactory(Command.GET_QUEST);
