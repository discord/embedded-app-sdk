import BigFlagUtils from './BigFlagUtils';
import type {BigFlag} from './BigFlagUtils';

function can(permission: BigFlag, permissions: BigFlag | string): boolean {
  return BigFlagUtils.has(BigFlagUtils.deserialize(permissions), permission);
}

export default {
  can,
};
