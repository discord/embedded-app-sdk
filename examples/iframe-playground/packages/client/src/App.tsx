import * as React from 'react';
import {BrowserRouter as Router, Routes, Route, Link, useLocation} from 'react-router-dom';

import * as Scrollable from './components/Scrollable';
import {AuthProvider} from './components/AuthProvider';
import DesignSystemProvider from './components/DesignSystemProvider';

import AvatarAndName from './pages/AvatarAndName';
import CurrentGuild from './pages/CurrentGuild';
import EncourageHardwareAcceleration from './pages/EncourageHardwareAcceleration';
import Guilds from './pages/Guilds';
import Home from './pages/Home';
import InAppPurchase from './pages/InAppPurchase';
import OpenExternalLink from './pages/OpenExternalLink';
import OpenInviteDialog from './pages/OpenInviteDialog';
import OpenShareMomentDialog from './pages/OpenShareMomentDialog';
import OpenAttachmentUpload from './pages/OpenAttachmentUpload';
import OrientationLockState from './pages/OrientationLockState';
import OrientationUpdates from './pages/OrientationUpdates';
import LayoutMode from './pages/LayoutMode';
import PlatformBehaviors from './pages/PlatformBehaviors';
import URLMappingParameters from './pages/URLMappingParameters';
import VoiceSettings from './pages/VoiceSettings';
import VoiceState from './pages/VoiceState';
import VisibilityListener from './pages/VisibilityListener';
import WindowSizeTracker from './pages/WindowSizeTracker';

import * as S from './AppStyles';
import SafeAreas from './pages/SafeAreas';
import ThermalStates from './pages/ThermalStates';
import ActivityChannel from './pages/ActivityChannel';
import Instance from './pages/Instance';

// Add contexts here
export default function App(): React.ReactElement {
  return (
    <AuthProvider>
      <DesignSystemProvider>
        <Router>
          <RootedApp />
        </Router>
      </DesignSystemProvider>
    </AuthProvider>
  );
}

interface AppRoute {
  path: string;
  name: string;
  component: () => JSX.Element;
}

const routes: Record<string, AppRoute> = {
  home: {
    path: '/',
    name: 'Home',
    component: Home,
  },
  avatarAndName: {
    path: '/avatar-and-name',
    name: 'Avatar and Name',
    component: AvatarAndName,
  },
  guilds: {
    path: '/guilds',
    name: 'Guilds',
    component: Guilds,
  },
  voiceSettings: {
    path: '/voice-settings',
    name: 'Voice Settings',
    component: VoiceSettings,
  },
  voiceState: {
    path: '/voice-state',
    name: 'Voice State',
    component: VoiceState,
  },
  urlMappingParameters: {
    path: '/url-mapping-parameters',
    name: 'URL Mapping Parameters',
    component: URLMappingParameters,
  },
  activityChannel: {
    path: '/activity-channel',
    name: 'Activity Channel',
    component: ActivityChannel,
  },
  currentGuild: {
    path: '/current-guild',
    name: 'Current Guild',
    component: CurrentGuild,
  },
  pipMode: {
    path: '/layout-mode',
    name: 'Layout Mode',
    component: LayoutMode,
  },
  platformBehaviors: {
    path: '/platform-behaviors',
    name: 'Platform Behaviors',
    component: PlatformBehaviors,
  },
  openExternalLink: {
    path: '/open-external-link',
    name: 'Open External Link',
    component: OpenExternalLink,
  },
  encourageHardwareAcceleration: {
    path: '/encourage-hw-acc',
    name: 'Encourage Hardware Acceleration',
    component: EncourageHardwareAcceleration,
  },
  setOrientationLockState: {
    path: '/set-orientation-lock-state',
    name: 'Orientation Lock State',
    component: OrientationLockState,
  },
  orientationUpdates: {
    path: '/orientation-updates',
    name: 'Orientation Updates',
    component: OrientationUpdates,
  },
  openInviteDialog: {
    path: '/open-invite-dialog',
    name: 'Open Invite Dialog',
    component: OpenInviteDialog,
  },
  OpenShareMomentDialog: {
    path: '/open-share-moment-dialog',
    name: 'Open Share Moment Dialog',
    component: OpenShareMomentDialog,
  },
  OpenAttachmentUpload: {
    path: '/open-attachment-upload',
    name: 'Open Attachment Upload',
    component: OpenAttachmentUpload,
  },
  safeAreas: {
    path: '/safe-areas',
    name: 'Safe Areas',
    component: SafeAreas,
  },
  inAppPurchase: {
    path: '/in-app-purchase',
    name: 'In App Purchase',
    component: InAppPurchase,
  },
  thermalStates: {
    path: '/thermal-states',
    name: 'Thermal States',
    component: ThermalStates,
  },
  visibilityListener: {
    path: '/visibility-listener',
    name: 'Visibility Listener',
    component: VisibilityListener,
  },
  windowSizeTracker: {
    path: '/window-size-tracker',
    name: 'Window Size Tracker',
    component: WindowSizeTracker,
  },
  instance: {
    path: '/instance',
    name: 'Instance Debug',
    component: Instance,
  },
};

function RootedApp(): React.ReactElement {
  const location = useLocation();
  return (
    <S.SiteWrapper>
      <Scrollable.Root
        css={{
          border: '1px solid black',
          height: '100%',
          width: '200px',
          '@small': {height: '200px', width: '100%'},
          '@xsmall': {height: 0, width: '100%'},
        }}>
        <Scrollable.Viewport>
          <S.Ul>
            {Object.values(routes).map((r) => (
              <S.Li as={Link} to={r.path} key={r.path} selected={location.pathname === r.path}>
                <p>{r.name}</p>
              </S.Li>
            ))}
          </S.Ul>
        </Scrollable.Viewport>
        <Scrollable.Scrollbar orientation="vertical">
          <Scrollable.Thumb />
        </Scrollable.Scrollbar>
      </Scrollable.Root>
      <Scrollable.Root css={{flex: 1}}>
        <Scrollable.Viewport css={{width: '100%'}}>
          <Routes>
            {Object.values(routes).map((r) => (
              <Route key={r.path} path={r.path} element={<r.component />} />
            ))}
          </Routes>
        </Scrollable.Viewport>
        <Scrollable.Scrollbar orientation="vertical">
          <Scrollable.Thumb />
        </Scrollable.Scrollbar>
      </Scrollable.Root>
    </S.SiteWrapper>
  );
}
