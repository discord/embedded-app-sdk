import * as zod from 'zod';
import {Commands, ReceiveFramePayload} from './common';
import {Schemas} from '../generated/schemas';
import assertUnreachable from '../utils/assertUnreachable';

export const SubscribeResponse = zod.object({
  evt: zod.string(),
});

export const ResponseFrame = ReceiveFramePayload.extend({
  cmd: zod.nativeEnum(Commands),
  evt: zod.null(),
});

function parseResponseData({cmd, data}: zod.infer<typeof ResponseFrame>) {
  switch (cmd) {
    case Commands.SUBSCRIBE:
    case Commands.UNSUBSCRIBE:
      return SubscribeResponse.parse(data);
    // START-GENERATED-SECTION
    case Commands.AUTHENTICATE:
    case Commands.AUTHORIZE:
    case Commands.CAPTURE_LOG:
    case Commands.ENCOURAGE_HW_ACCELERATION:
    case Commands.GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS:
    case Commands.GET_CHANNEL:
    case Commands.GET_CHANNELS:
    case Commands.GET_CHANNEL_PERMISSIONS:
    case Commands.GET_CONTEXT:
    case Commands.GET_ENTITLEMENTS_EMBEDDED:
    case Commands.GET_GUILD:
    case Commands.GET_PLATFORM_BEHAVIORS:
    case Commands.GET_QUEST:
    case Commands.GET_QUEST_ENROLLMENT_STATUS:
    case Commands.GET_RELATIONSHIPS:
    case Commands.GET_SKUS_EMBEDDED:
    case Commands.GET_USER:
    case Commands.INITIATE_IMAGE_UPLOAD:
    case Commands.INVITE_USER_EMBEDDED:
    case Commands.OPEN_EXTERNAL_LINK:
    case Commands.OPEN_INVITE_DIALOG:
    case Commands.OPEN_SHARE_MOMENT_DIALOG:
    case Commands.QUEST_START_TIMER:
    case Commands.REQUEST_PROXY_TICKET_REFRESH:
    case Commands.SET_ACTIVITY:
    case Commands.SET_CONFIG:
    case Commands.SET_ORIENTATION_LOCK_STATE:
    case Commands.SHARE_LINK:
    case Commands.START_PURCHASE:
    case Commands.USER_SETTINGS_GET_LOCALE:
      // END-GENERATED-SECTION
      const {response} = Schemas[cmd];
      return response.parse(data);
    default:
      assertUnreachable(cmd, new Error(`Unrecognized command ${cmd}`));
  }
}

export function parseResponsePayload(payload: zod.infer<typeof ResponseFrame>) {
  return {
    ...payload,
    data: parseResponseData(payload),
  };
}
