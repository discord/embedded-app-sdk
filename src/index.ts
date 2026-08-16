import {DiscordSDK} from './Discord';
import type {IDiscordSDK} from './interface';
import type * as Types from './schema/types';
import {CommandTypes, CommandResponseTypes, CommandResponse, CommandInputTypes, CommandInput} from './commands';
import {Events} from './schema/events';
import * as Common from './schema/common';
import * as Responses from './schema/responses';
import {Orientation, Permissions, Platform, RPCCloseCodes, RPCErrorCodes} from './Constants';
import PermissionUtils from './utils/PermissionUtils';
import PriceUtils from './utils/PriceUtils';
import {DiscordSDKMock} from './mock';
import {ISDKError} from './error';
import {SpatialVoice, SpatialVoiceSession} from './spatialVoice';
import {patchUrlMappings, attemptRemap} from './utils/patchUrlMappings';
export type {EventPayloadData} from './schema/events';

const {Commands} = Common;
export {
  DiscordSDK,
  DiscordSDKMock,
  SpatialVoice,
  SpatialVoiceSession,
  Events,
  Orientation,
  Platform,
  Common,
  Commands,
  Permissions,
  PermissionUtils,
  PriceUtils,
  RPCCloseCodes,
  RPCErrorCodes,
  Responses,
  patchUrlMappings,
  attemptRemap,
};
export type {
  IDiscordSDK,
  CommandTypes,
  CommandInput,
  CommandInputTypes,
  CommandResponse,
  CommandResponseTypes,
  ISDKError,
  Types,
};
export type {
  SpatialVoiceCapabilities,
  SpatialVoiceListener,
  SpatialVoiceParticipant,
  SpatialVoiceSource,
  SpatialVoiceSpeakingEvent,
  SpatialVoiceSpeakingListener,
  SpatialVoiceSpeakingUnsubscribe,
  SpatialVoiceUpdate,
  SpatialVoiceVector3,
} from './spatialVoice';
