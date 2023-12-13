import {Commands} from '../schema/common';
import {GetChannelResponse} from '../schema/responses';
import {TSendCommand} from '../schema/types';
import {commandFactory} from '../utils/commandFactory';

export interface GetChannelInput {
  channel_id: string;
}

/**
 *
 * @description
 * RPC documentation here: https://discord.com/developers/docs/topics/rpc#getchannel
 * Calling getChannel gets info about the requested channel such as the channel name.
 *
 * Supported Platforms
 * | Web | iOS | Android |
 * |-----|-----|---------|
 * | ✅  | ✅  | ✅      |
 *
 * Required scopes:
 * - [guilds] for guild channels
 * - [guilds, dm_channels.read] for GDM channels. dm_channels.read requires approval from Discord.
 *
 * @example
 * await discordSdk.commands.getActivity({
 *   channel_id: discordSdk.channelId,
 * });
 */
export const getChannel = (sendCommand: TSendCommand) =>
  commandFactory<GetChannelInput, typeof GetChannelResponse>(sendCommand, Commands.GET_CHANNEL, GetChannelResponse);
