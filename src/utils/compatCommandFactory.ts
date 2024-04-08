import * as zod from 'zod';
import {RPCErrorCodes} from '../Constants';
import {Commands, ReceiveFramePayload} from '../schema/common';
import {TSendCommand} from '../schema/types';

/**
 * @args - the primary args to send with the command.
 * @fallbackArgs - the args to try the command with in the case where an old Discord
 *  client doesn't support one of the new args.
 */
export default function compatCommandFactory<
  Args extends any,
  FallbackArgs extends any,
  Response extends zod.ZodTypeAny,
>({
  sendCommand,
  cmd,
  response,
  fallbackTransform,
  transferTransform = () => undefined,
}: {
  sendCommand: TSendCommand;
  cmd: Exclude<Commands, Commands.SUBSCRIBE | Commands.UNSUBSCRIBE>;
  response: zod.ZodTypeAny;
  fallbackTransform: (args: Args) => FallbackArgs;
  transferTransform?: (args: Args | FallbackArgs) => Transferable[] | undefined;
}): (args: Args) => Promise<zod.infer<Response>> {
  const payload = ReceiveFramePayload.extend({
    cmd: zod.literal(cmd),
    data: response,
  });

  return async (args: Args) => {
    try {
      const reply = await sendCommand({cmd, args, transfer: transferTransform(args)});
      const parsed = payload.parse(reply);
      return parsed.data;
    } catch (error: any) {
      if (error.code === RPCErrorCodes.INVALID_PAYLOAD) {
        const fallbackArgs = fallbackTransform(args);
        const reply = await sendCommand({cmd, args: fallbackArgs, transfer: transferTransform(fallbackArgs)});
        const parsed = payload.parse(reply);
        return parsed.data;
      } else {
        throw error;
      }
    }
  };
}
