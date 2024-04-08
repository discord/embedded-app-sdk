import * as zod from 'zod';
import * as Events from './events';
import * as Responses from './responses';
import * as Common from './common';
import {Platform} from '../Constants';

export const HelloPayload = zod.object({
  frame_id: zod.string(),
  platform: zod.nativeEnum(Platform).optional().nullable(),
});

export const ConnectPayload = zod.object({
  v: zod.literal(1),
  encoding: zod.literal('json').optional(),
  client_id: zod.string(),
  frame_id: zod.string(),
});

export const ClosePayload = zod.object({
  code: zod.number(),
  message: zod.string().optional(),
});

export {Events, Responses, Common};

export const IncomingPayload = zod
  .object({
    evt: zod.string().nullable(),
    nonce: zod.string().nullable(),
    data: zod.unknown().nullable(),
    cmd: zod.string(),
  })
  .passthrough();

export function parseIncomingPayload<K extends keyof typeof Events.EventSchema = keyof typeof Events.EventSchema>(
  payload: zod.infer<typeof IncomingPayload>,
):
  | zod.infer<(typeof Events.EventSchema)[K]['payload']>
  | zod.infer<typeof Responses.ResponseFrame>
  | zod.infer<typeof Events.ErrorEvent> {
  const incoming = IncomingPayload.parse(payload);

  if (incoming.evt != null) {
    if (incoming.evt === Events.ERROR) {
      return Events.ErrorEvent.parse(incoming);
    }
    return Events.parseEventPayload(Events.EventFrame.parse(incoming));
  } else {
    return Responses.parseResponsePayload(Responses.ResponseFrame.passthrough().parse(incoming));
  }
}
