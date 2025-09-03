import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

export const authenticate = schemaCommandFactory(Command.AUTHENTICATE);
