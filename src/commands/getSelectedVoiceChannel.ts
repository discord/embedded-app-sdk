import {Commands} from '../schema/common';
import {GetSelectedVoiceChannelResponse} from '../schema/responses';
import {TSendCommand} from '../schema/types';
import {commandFactory} from '../utils/commandFactory';

/**
 * Prefer using getChannel instead because the selected voice channel
 * is not always the same channel that the activity is mounted to e.g.
 * for Activities in text channels.
 */
export const getSelectedVoiceChannel = (sendCommand: TSendCommand) =>
  commandFactory<void, typeof GetSelectedVoiceChannelResponse>(
    sendCommand,
    Commands.GET_SELECTED_VOICE_CHANNEL,
    GetSelectedVoiceChannelResponse
  );
