import {Commands} from '../schema/common';
import {EmptyResponse} from '../schema/responses';
import {TSendCommand} from '../schema/types';
import {commandFactory} from '../utils/commandFactory';

export interface OpenExternalLinkInput {
  url: string;
}

/**
 *
 */
export const openExternalLink = (sendCommand: TSendCommand) =>
  commandFactory<OpenExternalLinkInput, typeof EmptyResponse>(sendCommand, Commands.OPEN_EXTERNAL_LINK, EmptyResponse);
