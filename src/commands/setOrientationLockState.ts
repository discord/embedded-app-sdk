import * as zod from 'zod';
import {Commands, OrientationLockState} from '../schema/common';
import {EmptyResponse} from '../schema/responses';
import {TSendCommand} from '../schema/types';
import compatCommandFactory from '../utils/compatCommandFactory';

export interface SetOrientationLockStateInputFallback {
  lock_state: zod.infer<typeof OrientationLockState>;
  picture_in_picture_lock_state?: zod.infer<typeof OrientationLockState> | null;
}

export interface SetOrientationLockStateInput extends SetOrientationLockStateInputFallback {
  grid_lock_state?: zod.infer<typeof OrientationLockState> | null;
}

const fallbackTransform = (args: SetOrientationLockStateInput) => {
  return {
    lock_state: args.lock_state,
    picture_in_picture_lock_state: args.picture_in_picture_lock_state,
  };
};

export const setOrientationLockState = (sendCommand: TSendCommand) =>
  compatCommandFactory<SetOrientationLockStateInput, SetOrientationLockStateInputFallback, typeof EmptyResponse>({
    sendCommand,
    cmd: Commands.SET_ORIENTATION_LOCK_STATE,
    response: EmptyResponse,
    fallbackTransform,
  });
