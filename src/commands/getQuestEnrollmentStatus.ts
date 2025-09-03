import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

export const getQuestEnrollmentStatus = schemaCommandFactory(Command.GET_QUEST_ENROLLMENT_STATUS);
