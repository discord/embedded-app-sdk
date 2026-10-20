import {Commands} from '../schema/common';
import {TSendCommand} from '../schema/types';

import {SetActivity} from './setActivity';
// START-GENERATED-SECTION
import {authenticate} from './authenticate';
import {authorize} from './authorize';
import {captureLog} from './captureLog';
import {encourageHardwareAcceleration} from './encourageHardwareAcceleration';
import {getActivityInstanceConnectedParticipants} from './getActivityInstanceConnectedParticipants';
import {getChannel} from './getChannel';
import {getChannels} from './getChannels';
import {getChannelPermissions} from './getChannelPermissions';
import {getContext} from './getContext';
import {getEntitlements} from './getEntitlements';
import {getGuild} from './getGuild';
import {getPlatformBehaviors} from './getPlatformBehaviors';
import {getQuest} from './getQuest';
import {getQuestEnrollmentStatus} from './getQuestEnrollmentStatus';
import {getRelationships} from './getRelationships';
import {getSkus} from './getSkus';
import {getUser} from './getUser';
import {initiateImageUpload} from './initiateImageUpload';
import {inviteUserEmbedded} from './inviteUserEmbedded';
import {openExternalLink} from './openExternalLink';
import {openInviteDialog} from './openInviteDialog';
import {openShareMomentDialog} from './openShareMomentDialog';
import {questStartTimer} from './questStartTimer';
import {requestProxyTicketRefresh} from './requestProxyTicketRefresh';
import {setActivity} from './setActivity';
import {setConfig} from './setConfig';
import {setOrientationLockState} from './setOrientationLockState';
import {shareLink} from './shareLink';
import {startPurchase} from './startPurchase';
import {userSettingsGetLocale} from './userSettingsGetLocale';
// END-GENERATED-SECTION

export {Commands, SetActivity};

function commands(sendCommand: TSendCommand) {
  return {
    // START-GENERATED-SECTION
    authenticate: authenticate(sendCommand),
    authorize: authorize(sendCommand),
    captureLog: captureLog(sendCommand),
    encourageHardwareAcceleration: encourageHardwareAcceleration(sendCommand),
    getActivityInstanceConnectedParticipants: getActivityInstanceConnectedParticipants(sendCommand),
    getChannel: getChannel(sendCommand),
    getChannels: getChannels(sendCommand),
    getChannelPermissions: getChannelPermissions(sendCommand),
    getContext: getContext(sendCommand),
    getEntitlements: getEntitlements(sendCommand),
    getGuild: getGuild(sendCommand),
    getPlatformBehaviors: getPlatformBehaviors(sendCommand),
    getQuest: getQuest(sendCommand),
    getQuestEnrollmentStatus: getQuestEnrollmentStatus(sendCommand),
    getRelationships: getRelationships(sendCommand),
    getSkus: getSkus(sendCommand),
    getUser: getUser(sendCommand),
    initiateImageUpload: initiateImageUpload(sendCommand),
    inviteUserEmbedded: inviteUserEmbedded(sendCommand),
    openExternalLink: openExternalLink(sendCommand),
    openInviteDialog: openInviteDialog(sendCommand),
    openShareMomentDialog: openShareMomentDialog(sendCommand),
    questStartTimer: questStartTimer(sendCommand),
    requestProxyTicketRefresh: requestProxyTicketRefresh(sendCommand),
    setActivity: setActivity(sendCommand),
    setConfig: setConfig(sendCommand),
    setOrientationLockState: setOrientationLockState(sendCommand),
    shareLink: shareLink(sendCommand),
    startPurchase: startPurchase(sendCommand),
    userSettingsGetLocale: userSettingsGetLocale(sendCommand),
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
