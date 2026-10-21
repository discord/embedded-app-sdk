import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

/**
 *
 */
export const getEntitlements = schemaCommandFactory(Command.GET_ENTITLEMENTS_EMBEDDED);
