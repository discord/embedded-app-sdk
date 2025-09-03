import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

export const getUser = schemaCommandFactory(Command.GET_USER);
