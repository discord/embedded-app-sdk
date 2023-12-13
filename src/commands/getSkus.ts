import {Commands} from '../schema/common';
import {GetSkusResponse} from '../schema/responses';
import {TSendCommand} from '../schema/types';
import {commandFactory} from '../utils/commandFactory';

/*
 *
 */
export const getSkus = (sendCommand: TSendCommand) =>
  commandFactory<void, typeof GetSkusResponse>(sendCommand, Commands.GET_SKUS_EMBEDDED, GetSkusResponse);
