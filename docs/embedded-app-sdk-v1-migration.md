# embedded-app-sdk V1 Migration

If you were previously using activity-iframe-sdk, this guide is for you. Think of `@discord/embedded-app-sdk` as the next version of `activity-iframe-sdk` with a few breaking changes. This document is aimed to help developers migrate their activity code from activity-iframe-sdk v2 to @discord/embedded-app-sdk v1.0.0 and beyond. If you are upgrading from activity-iframe-sdk v1, please first reference [this document](/docs/activity-iframe-sdk-v2-migration.md)

## tldr;

Here's the high level list of changes

- [New SDK Name](#new-sdk-name)
- [Typescript support for subscribe and unsubscribe](#typescript-support-for-subscribe-and-unsubscribe)
- [initializeNetworkShims is different](#initializenetworkshims-is-different)
- [Removing unused commands, events, and types](#removing-unused-commands-events-and-types)

### New SDK Name

We've renamed the SDK to align with the long-term vision for Discord apps. If you're embedding an app inside of Discord, this SDK has got you covered. The main use case today is for Discord apps which launch activities via iframes, however, as this name implies, this SDK could support use for Discord applications beyond just activities.

### Typescript support for subscribe and unsubscribe

Previously, there were no typescript types provided when subscribing to events. Now, as soon as you provide an event name, typescript can help infer the shape of data returned by the callback, as well as additional subscribeArgs, when necessary.

Often, you may not want to describe the subscription callback inline. If you are using typescript, you can define the event shape outside of the callback, using the generic type `EventPayloadData`. Check out this example where we subscribe to the `SPEAKING_START` event.

```ts
import {DiscordSDK, EventPayloadData} from '@discord/embedded-app-sdk';

// Initialize the SDK
const discordSdk = new DiscordSDK(CLIENT_ID);

// Retrieve the typescript type for the SPEAKING_START event
type SPEAKING_START_EVENT = EventPayloadData<'SPEAKING_START'>;

// Define the callback function that will fire whenever a SPEAKING_START event is captured
function handleStartTalking(event: SPEAKING_START_EVENT) {
  console.log(`user ${event.user_id} started talking`);
}

// Subscribe to the SPEAKING_START event and pass appropriate
discordSdk.subscribe('SPEAKING_START', handleStartTalking, {channel_id: discordSdk.channelId});
```

### initializeNetworkShims is different

If you're using `initializeNetworkShims` in your activity, you will need to migrate it to the new API `patchUrlMappings`. It's the same in spirit, but it has a few differences:

- We have renamed `initializeNetworkShims` to `patchUrlMappings`
- `patchUrlMappings` is now exported as a utility separate from the SDK. This allows you to initialize shims as soon as possible, separate from SDK initialization
- `patchUrlMappings` now includes new functionality that can update html `src` attributes to adjust to your url mappings.
- `patchUrlMappings` now includes a second argument where you can set specific configuration for each "shim". See usage in the example below

```ts
import {patchUrlMappings} from '@discord/embedded-app-sdk';

patchUrlMappings(
  [
    {
      target: 'google.com',
      prefix: '/google',
    },
  ],
  {
    patchFetch: true, // Defaults to true
    patchWebSocket: true, // Defaults to true
    patchXhr: true, // Defaults to true
    patchSrcAttributes: true, // Defaults to false (potentially compute expensive for your UI)
  }
);
```

### Removing unused commands and events

The original SDK included several events and commands which are either no longer relevant, unusable, or otherwise not something we want in the SDK.

The following were removed or modified:

- Removed Events
  - `ACTIVITY_JOIN`
    - If you are using this today, we encourage subscribing to the `ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE` event instead
  - `ACTIVITY_SPECTATE`
    - If you are using this today, we encourage subscribing to the `ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE` event instead
  - `ACTIVITY_PIP_MODE_UPDATE`
    - If you are using this today, we encourage subscribing to the `ACTIVITY_LAYOUT_MODE_UPDATE` event instead
  - `CAPTURE_SHORTCUT_CHANGE`
  - `GUILD_STATUS`
  - `GUILD_CREATE`
  - `CHANNEL_CREATE`
  - `VOICE_CHANNEL_CREATE`
  - `NOTIFICATION_CREATE`
  - `ACTIVITY_JOIN_REQUEST`
  - `VOICE_STATE_CREATE`
  - `VOICE_STATE_DELETE`
  - `VOICE_SETTINGS_UPDATE`
  - `VOICE_CONNECTION_STATUS`
- Removed Commands
  - `getSelectedVoiceChannel`
    We recommend using `getChannel` instead, where appropriate. If you need access to the current channel's id, it can be accessed immediately by the SDK, directly at `discordSdk.channelId`
  - `subscribeToLayoutModeUpdatesCompat` and `unsubscribeFromLayoutModeUpdatesCompat`
    - If you are using these today, we encourage subscribing to the `ACTIVITY_LAYOUT_MODE_UPDATE` event instead
  - `setUserVoiceSettings`
  - `setVoiceSettings`
  - `getVoiceSettings`
  - `startPremiumPurchase`

# Step by Step Guide

Each activity is implemented differently, but migrating to embedded-app-sdk from activity-iframe-sdk should be straightforward with the use of typescript. Here is a simple outline of how we expect the migration should occur.

0. If you are upgrading from `activity-iframe-sdk` v1, please review and implement the [activity-iframe-sdk v2 migration guide](/docs/activity-iframe-sdk-v2-migration.md) before following these steps.
1. Upgrade by uninstalling the old package and installing the new.
  - `npm uninstall @discord-external/activity-iframe-sdk`
  - `npm install @discord/embedded-app-sdk`
2. Remove any code related to installing a private github package. This will most likely look like removing a `.npmrc` file or other references to `npm.pkg.github.com`
3. Run typescript (`tsc`) and observe errors. Most of the errors will be related to usage of `subscribe`, or usage of removed commands and events, as expected.
4. Fix typescript errors. We expect most of not all typescript errors will be related to `subscribe`. The type `EventPayloadData<'YOUR_EVENT'>` will be your biggest helper here. Remove usage of unsupported events and command, and migrate as necessary, per recommandations [above](#removing-unused-commands-and-events)
5. Perform a basic test of key functionality.
6. Profit from having type safety and the latest SDK updates from here on out!

## SDK Playground Example migration

As a real example, our `sdk-playground` example application migrated to @discord/embedded-app-sdk 1.0.0 from @discord/activity-iframe-sdk. This is a summary of all the changes required.

### Migrate subscribeToLayoutModeUpdatesCompat command to instead subscribe to the ACTIVITY_LAYOUT_MODE_UPDATE event

```diff
examples/sdk-playground/packages/client/src/pages/LayoutMode.tsx
- import {Common} from '@discord/activity-iframe-sdk';
+ import {Common, EventPayloadData} from '@discord/embedded-app-sdk';

-  const handleLayoutModeUpdate = React.useCallback((update: {layout_mode: number}) => {
+  const handleLayoutModeUpdate = React.useCallback((update: EventPayloadData<'ACTIVITY_LAYOUT_MODE_UPDATE'>) => {

  React.useEffect(() => {
-    discordSdk.subscribeToLayoutModeUpdatesCompat(handleLayoutModeUpdate);
+    discordSdk.subscribe('ACTIVITY_LAYOUT_MODE_UPDATE', handleLayoutModeUpdate);
    return () => {
-      discordSdk.unsubscribeFromLayoutModeUpdatesCompat(handleLayoutModeUpdate);
+      discordSdk.unsubscribe('ACTIVITY_LAYOUT_MODE_UPDATE', handleLayoutModeUpdate);
```

### Migrate event subscriptions to define event shape

```diff
examples/sdk-playground/packages/client/src/pages/Instance.tsx
- import {Events, Types} from '@discord/activity-iframe-sdk';
+ import {Events, EventPayloadData} from '@discord/embedded-app-sdk';

- type UpdateEvent = Types.GetActivityInstanceConnectedParticipantsResponse;
+ type UpdateEvent = EventPayloadData<'ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE'>;
```

### Migrate usage of initializeNetworkShims to patchUrlMappings

```diff

- import {DiscordSDK, DiscordSDKMock, IDiscordSDK} from '@discord/embedded-app-sdk';
+ import {DiscordSDK, DiscordSDKMock, IDiscordSDK, patchUrlMappings} from '@discord/embedded-app-sdk';

-   discordSdk.initializeNetworkShims(mappings);
+   patchUrlMappings(mappings);
```
