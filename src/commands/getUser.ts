import {schemaCommandFactory} from '../utils/commandFactory';
import {Command} from '../generated/schemas';

export const getUser = schemaCommandFactory(Command.GET_USER);
