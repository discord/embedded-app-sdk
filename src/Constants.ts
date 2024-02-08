import BigFlagUtils from './utils/BigFlagUtils';

export enum RPCCloseCodes {
  CLOSE_NORMAL = 1000,
  CLOSE_UNSUPPORTED = 1003,
  CLOSE_ABNORMAL = 1006,
  INVALID_CLIENTID = 4000,
  INVALID_ORIGIN = 4001,
  RATELIMITED = 4002,
  TOKEN_REVOKED = 4003,
  INVALID_VERSION = 4004,
  INVALID_ENCODING = 4005,
}

export enum RPCErrorCodes {
  INVALID_PAYLOAD = 4000,
  INVALID_COMMAND = 4002,
  INVALID_EVENT = 4004,
  INVALID_PERMISSIONS = 4006,
}

/**
 * @deprecated use OrientationTypeObject instead
 */
export enum Orientation {
  LANDSCAPE = 'landscape',
  PORTRAIT = 'portrait',
}

export enum Platform {
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
}

export const Permissions = Object.freeze({
  CREATE_INSTANT_INVITE: BigFlagUtils.getFlag(0),
  ADMINISTRATOR: BigFlagUtils.getFlag(3),
});
