import {Commands} from '../schema/common';
import {TSendCommand} from '../schema/types';

import {authorize} from './authorize';
import {captureLog} from './captureLog';
import {encourageHardwareAcceleration} from './encourageHardwareAcceleration';
import {getChannel} from './getChannel';
import {getEntitlements} from './getEntitlements';
import {getSkus} from './getSkus';
import {getChannelPermissions} from './getChannelPermissions';
import {getPlatformBehaviors} from './getPlatformBehaviors';
import {openExternalLink} from './openExternalLink';
import {openInviteDialog} from './openInviteDialog';
import {setActivity, SetActivity} from './setActivity';
import {setConfig} from './setConfig';
import {setOrientationLockState} from './setOrientationLockState';
import {startPurchase} from './startPurchase';
import {userSettingsGetLocale} from './userSettingsGetLocale';
// START-GENERATED-SECTION
import {authenticate} from './authenticate';
import {getActivityInstanceConnectedParticipants} from './getActivityInstanceConnectedParticipants';
import {getQuestEnrollmentStatus} from './getQuestEnrollmentStatus';
import {getRelationships} from './getRelationships';
import {getUser} from './getUser';
import {initiateImageUpload} from './initiateImageUpload';
import {inviteUserEmbedded} from './inviteUserEmbedded';
import {openShareMomentDialog} from './openShareMomentDialog';
import {questStartTimer} from './questStartTimer';
import {shareInteraction} from './shareInteraction';
import {shareLink} from './shareLink';
// END-GENERATED-SECTION

export {Commands, SetActivity};

function commands(sendCommand: TSendCommand) {
  return {
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
    setActivity: setActivity(sendCommand),
    setConfig: setConfig(sendCommand),
    setOrientationLockState: setOrientationLockState(sendCommand),
    startPurchase: startPurchase(sendCommand),
    userSettingsGetLocale: userSettingsGetLocale(sendCommand),
    // START-GENERATED-SECTION
    authenticate: authenticate(sendCommand),
    getActivityInstanceConnectedParticipants: getActivityInstanceConnectedParticipants(sendCommand),
    getQuestEnrollmentStatus: getQuestEnrollmentStatus(sendCommand),
    getRelationships: getRelationships(sendCommand),
    getUser: getUser(sendCommand),
    initiateImageUpload: initiateImageUpload(sendCommand),
    inviteUserEmbedded: inviteUserEmbedded(sendCommand),
    openShareMomentDialog: openShareMomentDialog(sendCommand),
    questStartTimer: questStartTimer(sendCommand),
    shareInteraction: shareInteraction(sendCommand),
    shareLink: shareLink(sendCommand),
    // END-GENERATED-SECTION
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
