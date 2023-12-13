# Embedded Links

Due to activities being sandboxed, activities will need to perform a command in order for users to launch any external links.
Users will be notified inside the discord app whether or not they want to open the external link.

## Usage

```javascript
import {DiscordSDK} from '@discord/embedded-app-sdk';
const discordSdk = new DiscordSDK(clientId);
await discordSdk.ready();
// Once the sdk has established the connection with the discord client, external
// links can be launched
discordSdk.commands.openExternalLink({
  url: 'https://google.com',
});
```

## User Experience

![external-link-modal](/docs/assets/external-link-modal.png)

Users will see a modal inside the Discord app notifying them whether or not they want to proceed. By clicking **_Trust this Domain_**,
users will not see a modal for that specific domain again.
