import * as zod from 'zod';
import {Commands, ReceiveFramePayload} from '../schema/common';
import type {TSendCommand} from '../schema/types';
import {Command, Schemas} from '../generated/schemas';

export function commandFactory<Args extends any, Response extends zod.ZodTypeAny>(
  sendCommand: TSendCommand,
  cmd: Exclude<Commands, Commands.SUBSCRIBE | Commands.UNSUBSCRIBE>,
  response: zod.ZodTypeAny,
  transferTransform: (args: Args) => Transferable[] | undefined = () => undefined,
): (args: Args) => Promise<zod.infer<Response>> {
  const payload = ReceiveFramePayload.extend({
    cmd: zod.literal(cmd),
    data: response,
  });

  return async (args: Args) => {
    const reply = await sendCommand({cmd, args, transfer: transferTransform(args)});
    const parsed = payload.parse(reply);
    return parsed.data;
  };
}

type InferArgs<T extends Command> = zod.infer<(typeof Schemas)[T]['request']>;
type InferResponse<T extends Command> = zod.infer<(typeof Schemas)[T]['response']>;

export function schemaCommandFactory<T extends Command, TArgs = InferArgs<T>>(
  cmd: T,
  transferTransform: (args: TArgs) => Transferable[] | undefined = () => undefined,
): (sendCommand: TSendCommand) => (args: TArgs) => Promise<InferResponse<T>> {
  const response = Schemas[cmd].response;
  const payload = ReceiveFramePayload.extend({
    cmd: zod.literal(cmd),
    data: response,
  });

  return (sendCommand) => async (args) => {
    const reply = await sendCommand({
      // @ts-expect-error - Merge commands
      cmd: cmd,
      args,
      transfer: transferTransform(args),
    });
    const parsed = payload.parse(reply);
    return parsed.data;
  };
}
