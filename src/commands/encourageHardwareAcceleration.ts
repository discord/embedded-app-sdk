import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

/**
 *
 */
export const encourageHardwareAcceleration = schemaCommandFactory(Command.ENCOURAGE_HW_ACCELERATION);
