import {Commands} from '../schema/common';
import {VoiceSettingsResponse} from '../schema/responses';
import {TSendCommand} from '../schema/types';
import {commandFactory} from '../utils/commandFactory';

/**
 *
 */
export const getVoiceSettings = (sendCommand: TSendCommand) =>
  commandFactory<void, typeof VoiceSettingsResponse>(sendCommand, Commands.GET_VOICE_SETTINGS, VoiceSettingsResponse);
