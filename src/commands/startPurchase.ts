import {Commands} from '../schema/common';
import {StartPurchaseResponse} from '../schema/responses';
import {TSendCommand} from '../schema/types';
import {commandFactory} from '../utils/commandFactory';

export interface StartPurchaseInput {
  sku_id: string;
  pid?: number;
}

/**
 *
 */
export const startPurchase = (sendCommand: TSendCommand) =>
  commandFactory<StartPurchaseInput, typeof StartPurchaseResponse>(
    sendCommand,
    Commands.START_PURCHASE,
    StartPurchaseResponse,
  );
