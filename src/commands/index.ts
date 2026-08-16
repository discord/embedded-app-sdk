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
import {getQuest} from './getQuest';
import {getQuestEnrollmentStatus} from './getQuestEnrollmentStatus';
import {getRelationships} from './getRelationships';
import {getSpatialVoiceCapabilities} from './getSpatialVoiceCapabilities';
import {getSpatialVoiceParticipants} from './getSpatialVoiceParticipants';
import {getUser} from './getUser';
import {initiateImageUpload} from './initiateImageUpload';
import {inviteUserEmbedded} from './inviteUserEmbedded';
import {openShareMomentDialog} from './openShareMomentDialog';
import {questStartTimer} from './questStartTimer';
import {requestProxyTicketRefresh} from './requestProxyTicketRefresh';
import {resumeSpatialVoiceSession} from './resumeSpatialVoiceSession';
import {shareInteraction} from './shareInteraction';
import {shareLink} from './shareLink';
import {startSpatialVoiceSession} from './startSpatialVoiceSession';
import {stopSpatialVoiceSession} from './stopSpatialVoiceSession';
import {suspendSpatialVoiceSession} from './suspendSpatialVoiceSession';
import {updateSpatialVoiceSession} from './updateSpatialVoiceSession';
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
    // Backward compatibility - getInstanceConnectedParticipants is an alias for getActivityInstanceConnectedParticipants
    getInstanceConnectedParticipants: getActivityInstanceConnectedParticipants(sendCommand),
    // START-GENERATED-SECTION
    authenticate: authenticate(sendCommand),
    getActivityInstanceConnectedParticipants: getActivityInstanceConnectedParticipants(sendCommand),
    getQuest: getQuest(sendCommand),
    getQuestEnrollmentStatus: getQuestEnrollmentStatus(sendCommand),
    getRelationships: getRelationships(sendCommand),
    getSpatialVoiceCapabilities: getSpatialVoiceCapabilities(sendCommand),
    getSpatialVoiceParticipants: getSpatialVoiceParticipants(sendCommand),
    getUser: getUser(sendCommand),
    initiateImageUpload: initiateImageUpload(sendCommand),
    inviteUserEmbedded: inviteUserEmbedded(sendCommand),
    openShareMomentDialog: openShareMomentDialog(sendCommand),
    questStartTimer: questStartTimer(sendCommand),
    requestProxyTicketRefresh: requestProxyTicketRefresh(sendCommand),
    resumeSpatialVoiceSession: resumeSpatialVoiceSession(sendCommand),
    shareInteraction: shareInteraction(sendCommand),
    shareLink: shareLink(sendCommand),
    startSpatialVoiceSession: startSpatialVoiceSession(sendCommand),
    stopSpatialVoiceSession: stopSpatialVoiceSession(sendCommand),
    suspendSpatialVoiceSession: suspendSpatialVoiceSession(sendCommand),
    updateSpatialVoiceSession: updateSpatialVoiceSession(sendCommand),
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
