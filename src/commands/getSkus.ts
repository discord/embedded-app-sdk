import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

/*
 *
 */
export const getSkus = schemaCommandFactory(Command.GET_SKUS_EMBEDDED);
