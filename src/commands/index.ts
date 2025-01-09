import {Commands} from '../schema/common';
import {TSendCommand} from '../schema/types';

import {authenticate} from './authenticate';
import {authorize} from './authorize';
import {captureLog} from './captureLog';
import {encourageHardwareAcceleration} from './encourageHardwareAcceleration';
import {getEntitlements} from './getEntitlements';
import {getSkus} from './getSkus';
import {getChannelPermissions} from './getChannelPermissions';
import {getPlatformBehaviors} from './getPlatformBehaviors';
import {openExternalLink} from './openExternalLink';
import {openInviteDialog} from './openInviteDialog';
import {openShareMomentDialog} from './openShareMomentDialog';
import {setActivity, SetActivity} from './setActivity';
import {setConfig} from './setConfig';
import {setOrientationLockState} from './setOrientationLockState';
import {shareLink} from './shareLink';
import {startPurchase} from './startPurchase';
import {userSettingsGetLocale} from './userSettingsGetLocale';
import {initiateImageUpload} from './initiateImageUpload';
import {getChannel} from './getChannel';
import {getInstanceConnectedParticipants} from './getInstanceConnectedParticipants';

export {Commands, SetActivity};

function commands(sendCommand: TSendCommand) {
  return {
    authenticate: authenticate(sendCommand),
    authorize: authorize(sendCommand),
    captureLog: captureLog(sendCommand),
    encourageHardwareAcceleration: encourageHardwareAcceleration(sendCommand),
    getChannel: getChannel(sendCommand),
    getChannelPermissions: getChannelPermissions(sendCommand),
    getEntitlements: getEntitlements(sendCommand),
    getPlatformBehaviors: getPlatformBehaviors(sendCommand),
    getSkus: getSkus(sendCommand),
    openExternalLink: openExternalLink(sendCommand),
    openInviteDialog: openInviteDialog(sendCommand),
    openShareMomentDialog: openShareMomentDialog(sendCommand),
    setActivity: setActivity(sendCommand),
    setConfig: setConfig(sendCommand),
    setOrientationLockState: setOrientationLockState(sendCommand),
    shareLink: shareLink(sendCommand),
    startPurchase: startPurchase(sendCommand),
    userSettingsGetLocale: userSettingsGetLocale(sendCommand),
    initiateImageUpload: initiateImageUpload(sendCommand),
    getInstanceConnectedParticipants: getInstanceConnectedParticipants(sendCommand),
  };
}

export default commands;

// supported in typescript 4.5
type Awaited<T> = T extends Promise<infer U> ? U : never;

export type CommandTypes = ReturnType<typeof commands>;
export type CommandResponseTypes = {
  [Name in keyof CommandTypes]: Awaited<ReturnType<CommandTypes[Name]>>;
};
export type CommandResponse<K extends keyof CommandTypes> = Awaited<ReturnType<CommandTypes[K]>>;
export type CommandInputTypes = {
  [Name in keyof CommandTypes]: Parameters<CommandTypes[Name]>;
};
export type CommandInput<K extends keyof CommandTypes> = Parameters<CommandTypes[K]>;
