import {Commands} from '../schema/common';
import {UserSettingsGetLocaleResponse} from '../schema/responses';
import {TSendCommand} from '../schema/types';
import {commandFactory} from '../utils/commandFactory';

/**
 *
 */
export const userSettingsGetLocale = (sendCommand: TSendCommand) =>
  commandFactory<void, typeof UserSettingsGetLocaleResponse>(
    sendCommand,
    Commands.USER_SETTINGS_GET_LOCALE,
    UserSettingsGetLocaleResponse,
  );
