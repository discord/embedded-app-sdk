import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

export const questStartTimer = schemaCommandFactory(Command.QUEST_START_TIMER);
