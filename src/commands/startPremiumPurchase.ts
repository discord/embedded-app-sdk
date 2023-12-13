import {Commands} from '../schema/common';
import {EmptyResponse} from '../schema/responses';
import {TSendCommand} from '../schema/types';
import {commandFactory} from '../utils/commandFactory';

/**
 *
 */
export const startPremiumPurchase = (sendCommand: TSendCommand) =>
  commandFactory<void, typeof EmptyResponse>(sendCommand, Commands.START_PREMIUM_PURCHASE, EmptyResponse);
