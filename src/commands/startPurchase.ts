import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

/**
 *
 */
export const startPurchase = schemaCommandFactory(Command.START_PURCHASE);
