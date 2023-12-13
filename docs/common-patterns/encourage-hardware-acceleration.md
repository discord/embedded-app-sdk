# Encourage Hardware Acceleration

Activities that are compute intensive may benefit from encouraging users to enable hardware acceleration. When an application invokes the `encourageHardwareAcceleration` command the current status of the setting will be returned and the user will be prompted to update the setting, if applicable.

## Usage

```javascript
import {DiscordSDK} from '@discord/embedded-app-sdk';
const discordSdk = new DiscordSDK(clientId);
await discordSdk.ready();
const {enabled} = await discordSdk.commands.encourageHardwareAcceleration();
console.log(`Hardware Acceleration is ${enabled === true ? 'enabled' : 'disabled'}`);
```

## Best Practices

Switching Hardware Acceleration setting causes the Discord client to quit and re-launch, so it is best practice to invoke this command as soon as possible, so users do not begin the experience of an application before restarting. Ideally, this is immediately after `await discordSdk.ready()`.

## User Experience

![encourage-hardware-acceleration-modal](/docs/assets/encourage-hardware-acceleration-modal.png)

Users will see a modal inside the Discord app if Hardware Acceleration is disabled, encouraging them to change the setting. By clicking **Don't show me this again** they will not see the modal for _any application_ on this device again.
