import {Commands} from '../schema/common';
import {SetConfigResponse} from '../schema/responses';
import {TSendCommand} from '../schema/types';
import {commandFactory} from '../utils/commandFactory';

export interface SetConfigInput {
  use_interactive_pip: boolean;
}

/**
 *
 */
export const setConfig = (sendCommand: TSendCommand) =>
  commandFactory<SetConfigInput, typeof SetConfigResponse>(sendCommand, Commands.SET_CONFIG, SetConfigResponse);
