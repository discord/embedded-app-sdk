import * as zod from 'zod';
import {Command} from '../generated/schemas';
import {Activity} from '../schema/common';
import {schemaCommandFactory} from '../utils/commandFactory';

export const SetActivity = Activity.pick({
  state: true,
  state_url: true,
  details: true,
  details_url: true,
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
export const setActivity = schemaCommandFactory<Command.SET_ACTIVITY, SetActivityInput>(Command.SET_ACTIVITY);
