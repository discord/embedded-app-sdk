import {Commands} from '../schema/common';
import {EncourageHardwareAccelerationResponse} from '../schema/responses';
import {TSendCommand} from '../schema/types';
import {commandFactory} from '../utils/commandFactory';

/**
 *
 */
export const encourageHardwareAcceleration = (sendCommand: TSendCommand) =>
  commandFactory<void, typeof EncourageHardwareAccelerationResponse>(
    sendCommand,
    Commands.ENCOURAGE_HW_ACCELERATION,
    EncourageHardwareAccelerationResponse,
  );
