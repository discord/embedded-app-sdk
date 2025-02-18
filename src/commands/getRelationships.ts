import {schemaCommandFactory} from '../utils/commandFactory';
import {Command} from '../generated/schemas';

export const getRelationships = schemaCommandFactory(Command.GET_RELATIONSHIPS);
