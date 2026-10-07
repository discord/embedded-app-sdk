import {Command} from '../generated/schemas';
import {ConsoleLevel} from '../utils/console';
import {schemaCommandFactory} from '../utils/commandFactory';

export interface CaptureLogInput {
  level: ConsoleLevel;
  message: string;
}

/**
 *
 */
export const captureLog = schemaCommandFactory<Command.CAPTURE_LOG, CaptureLogInput>(Command.CAPTURE_LOG);
