import * as zod from 'zod';
import {ReceiveFramePayload} from '../schema/common';
import type {TSendCommand} from '../schema/types';
import {Command, Schemas} from '../generated/schemas';

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
