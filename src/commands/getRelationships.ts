import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

export const getRelationships = schemaCommandFactory(Command.GET_RELATIONSHIPS);
