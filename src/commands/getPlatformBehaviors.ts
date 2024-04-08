import {Commands} from '../schema/common';
import {GetPlatformBehaviorsResponse} from '../schema/responses';
import {TSendCommand} from '../schema/types';
import {commandFactory} from '../utils/commandFactory';

/**
 * Returns an object with information about platform behaviors
 * This command can be utilized to inform and react to a breaking change in platform behavior
 *
 * @returns {GetPlatformBehaviorsPayload} payload - The command return value
 * @returns {boolean} payload.data.iosKeyboardResizesView - If on iOS the webview is resized when the keyboard is opened
 */
export const getPlatformBehaviors = (sendCommand: TSendCommand) =>
  commandFactory<void, typeof GetPlatformBehaviorsResponse>(
    sendCommand,
    Commands.GET_PLATFORM_BEHAVIORS,
    GetPlatformBehaviorsResponse,
  );
