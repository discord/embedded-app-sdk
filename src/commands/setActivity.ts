import * as zod from 'zod';
import {Activity, Commands} from '../schema/common';
import {SetActivityResponse} from '../schema/responses';
import {TSendCommand} from '../schema/types';
import {commandFactory} from '../utils/commandFactory';

export const SetActivity = Activity.pick({
  state: true,
  details: true,
  timestamps: true,
  assets: true,
  party: true,
  secrets: true,
  instance: true,
  type: true,
})
  .extend({
    type: Activity.shape.type.optional(),
    instance: Activity.shape.instance.optional(),
  })
  .nullable();

export interface SetActivityInput {
  activity: zod.infer<typeof SetActivity>;
}

/**
 *
 * @description
 * RPC documentation here: https://discord.com/developers/docs/topics/rpc#setactivity
 * Calling setActivity allows modifying how your activity's rich presence is displayed in the Discord App
 *
 * Supported Platforms
 * | Web | iOS | Android |
 * |-----|-----|---------|
 * | ✅  | ✅  | ✅      |
 *
 * Required scopes: [rpc.activities.write]
 *
 * @example
 * await discordSdk.commands.setActivity({
 *   activity: {
 *     type: 0,
 *     details: 'Details',
 *     state: 'Playing',
 *   },
 * });
 */
export const setActivity = (sendCommand: TSendCommand) =>
  commandFactory<SetActivityInput, typeof SetActivityResponse>(sendCommand, Commands.SET_ACTIVITY, SetActivityResponse);
