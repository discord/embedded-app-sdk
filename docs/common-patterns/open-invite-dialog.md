# Open Invite Dialog

Getting an Application Channel Invite, as outlined in [these docs](https://discord.com/developers/docs/resources/invite#get-invite), is not granted by any OAuth scopes. Nonetheless, the `openInviteDialog` command is available via the SDK. This command opens the Application Channel Invite UI within the discord client without requiring additional OAuth scopes.

This command returns an error when called from (G)DM contexts, so should only be called in Guild Voice Channels. Similarly, this command returns an error if the user has invalid permissions for the channel, so using `getChannelPermissions` (requires Auth scope `'guild.members.read'`) is highly recommend.

## Usage

```javascript
import {DiscordSDK, Permissions, PermissionUtils} from '@discord/embedded-app-sdk';
const discordSdk = new DiscordSDK(clientId);
await discordSdk.ready();

try {
  const {permissions} = await discordSdk.commands.getChannelPermissions();
  if (PermissionUtils.can(Permissions.CREATE_INSTANT_INVITE, permissions)) {
    await discordSdk.commands.openInviteDialog();
    // successfully opened dialog
  } else {
    console.warn('User does not have CREATE_INSTANT_INVITE permissions');
  }
} catch (err) {
  // failed to fetch permissions or open dialog
  console.warn(err.message);
}
```
