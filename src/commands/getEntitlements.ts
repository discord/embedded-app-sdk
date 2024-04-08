import {Commands} from '../schema/common';
import {GetEntitlementsResponse} from '../schema/responses';
import {TSendCommand} from '../schema/types';
import {commandFactory} from '../utils/commandFactory';

/**
 *
 */
export const getEntitlements = (sendCommand: TSendCommand) =>
  commandFactory<void, typeof GetEntitlementsResponse>(
    sendCommand,
    Commands.GET_ENTITLEMENTS_EMBEDDED,
    GetEntitlementsResponse,
  );
