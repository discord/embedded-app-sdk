import {Commands} from '../schema/common';
import {SetUserVoiceSettingsResponse} from '../schema/responses';
import {TSendCommand} from '../schema/types';
import {commandFactory} from '../utils/commandFactory';

export interface SetUserVoiceSettingsInput {
  user_id: string;
  volume?: number;
  mute?: boolean;
  pan?: {left: number; right: number};
}

/**
 *
 */
export const setUserVoiceSettings = (sendCommand: TSendCommand) =>
  commandFactory<SetUserVoiceSettingsInput, typeof SetUserVoiceSettingsResponse>(
    sendCommand,
    Commands.SET_USER_VOICE_SETTINGS,
    SetUserVoiceSettingsResponse
  );
