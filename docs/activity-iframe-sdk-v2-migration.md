# V2 Migration

Version 2.0.0 represents a breaking change to the shape of the SDK. This document is aimed to help developers migrate their activity code from a v1 release to v2.0.0 and beyond.

If you are migrating from `@discord/activity-iframe-sdk` v2 to `@discord/embedded-app-sdk` v1 please see [this document](/docs/embedded-app-sdk-v1-migration.md) instead.

# Command Migration

The primary change to the SDK in 2.0.0 is a standardization of the command return shape. Previously, a command could return the "Paylod" or the "Data", and each command was different. For example, `authorize` would return "data" but `getChannelPermissions` would return a "Payload".

```ts
// V1

// "Data" command
const {code} = await sdk.commands.authorize();

// "Payload" command
const {
  cmd,
  data: {permissions},
  evt,
  nonce,
} = await discordSdk.commands.getChannelPermissions();
```

The additional field of "Payload" commands are not useful for activity developers, and are used internally in the SDK. As such, we decided to make all commands "Data" commands, meaning in v2.0.0+ all commands simply return the desired data.

```ts
// V2

const {code} = await sdk.commands.authorize();
const {permissions} = await discordSdk.commands.getChannelPermissions();
```

An additional benefit of standardization of commands is better type inference. Previously, return value of the command was not obvious, and often referenced `zod`, a library used in the SDK to parse messages sent across the IPC bridge. We made it easier for typescript and activity developers to understand what any command does by annontating the commands with `zod`-less, straightforward types. Let's use `getChannelPermissions` as an example again.

```diff
- (property) getChannelPermissions: TPayloadCommand<Commands.GET_CHANNEL_PERMISSIONS, void, GetChannelPermissionsOutput> // v1
+ (property) getChannelPermissions: (args: void) => Promise<{ permissions: string | bigint;}> // v2
```

The v1 shape is undecipherable, and references other enums and shapes from within the SDK. It is not even clear that `getChannelPermissions` is a function.
The v2 shape, on the other hand, is quite clear. `getChannelPermissions` is an async function which returns an object containing attribute `permissions` which is either a `string` or a `bigint`.

# Step by Step Guide

Each activity is implemented differently, but migrating to v2 from v1 should be straightforward with the use of typescript. Here is a simple outline of how we expect the migration should occur.

1. Upgrade to 2.0.0 by updating `package.json` and installing (eg `yarn install`).
2. Run typescript (`tsc`) and observe errors. Most of the errors will be about the shape of commands, as expected.
3. Fix typescript errors. We expect most of not all typescript errors will be related to commands, and most of these will be fixed simply be removing `.data` from command responses (as now the response is the data) or changing the way the command response is deconstructed to simply deconstruct the data object.
4. Perform another audit of command usage within your activity, to catch those that are potentially not covered by typescript.
5. Perform a basic test of key functionality.
6. Profit from having standardized command shapes and better types from here on out!

## SDK Playground Example migration

As a real example, here are several examples' files migrated to 2.0.0 from v1.11.0 and this is a summary of all the changes required.

```diff
examples/discord-activity-starter/packages/client/src/main.ts
 const {data: selectedVoiceChannel} = await discordSdk.commands.getSelectedVoiceChannel();
+ const selectedVoiceChannel = await discordSdk.commands.getSelectedVoiceChannel();

examples/sdk-playground/packages/client/src/pages/CurrentGuild.tsx
- const {data} = await discordSdk.commands.getSelectedVoiceChannel();
- const guildId = data?.guild_id;
+ const channel = await discordSdk.commands.getSelectedVoiceChannel();
+ const guildId = channel?.guild_id;

examples/sdk-playground/packages/client/src/pages/EncourageHardwareAcceleration.tsx
- const {data} = await discordSdk.commands.encourageHardwareAcceleration();
- setHWAccEnabled(data?.enabled ?? null);
+ const {enabled} = await discordSdk.commands.encourageHardwareAcceleration();
+ setHWAccEnabled(enabled === true);

examples/sdk-playground/packages/client/src/pages/InAppPurchase.tsx
- const skusResp = await discordSdk.commands.getSkus();
- setRpcSkus(skusResp.data as Sku[]);
+ const skus = await discordSdk.commands.getSkus();
+ setRpcSkus(skus);

examples/sdk-playground/packages/client/src/pages/OpenInviteDialog.tsx
- const { data: {permissions} } = await discordSdk.commands.getChannelPermissions();
+ const {permissions} = await discordSdk.commands.getChannelPermissions();

examples/sdk-playground/packages/client/src/pages/PlatformBehaviors.tsx
- const {data} = await discordSdk.commands.getPlatformBehaviors();
- setPlatformBehaviors(data);
+ const behaviors = await discordSdk.commands.getPlatformBehaviors();
+ setPlatformBehaviors(behaviors);

examples/sdk-playground/packages/client/src/pages/VoiceSettings.tsx
- const voiceSettingsResp = await discordSdk.commands.getVoiceSettings();
- setVoiceSettings(voiceSettingsResp.data);
+ const voiceSettings = await discordSdk.commands.getVoiceSettings();
- setVoiceSettings(voiceSettings);
```
