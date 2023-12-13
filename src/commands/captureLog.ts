import {Commands} from '../schema/common';
import {EmptyResponse} from '../schema/responses';
import {TSendCommand} from '../schema/types';
import {ConsoleLevel} from '../utils/console';
import {commandFactory} from '../utils/commandFactory';

export interface CaptureLogInput {
  level: ConsoleLevel;
  message: string;
}

/**
 *
 */
export const captureLog = (sendCommand: TSendCommand) =>
  commandFactory<CaptureLogInput, typeof EmptyResponse>(sendCommand, Commands.CAPTURE_LOG, EmptyResponse);
