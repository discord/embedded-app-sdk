# Application Instance Management

![join-application](/docs/assets/join-application.png)

When a user clicks "Join Application", they expect to enter the same application that their friends are participating in. Whether the application is a shared drawing canvas, board game, collaborative playlist, or first-person shooter; the two users should have access to the same shared data. In this documentation, we refer to this shared data as an **application instance**.

The Discord Activities IFrame SDK allows your activities to talk bidirectionally with the Discord Client. The `instanceId` is necessary for your application, as well as Discord, to understand which unique instance of an application it is talking to.

## Using `instanceId`

The `instanceId` attribute is available as soon as the SDK is constructed, and does not require the SDK to receive a `ready` payload from the Discord client.

```typescript
import {DiscordSDK} from '@discord/embedded-app-sdk';
const discordSdk = new DiscordSDK(clientId);
// available immediately
const instanceId = discordSdk.instanceId;
```

The `instanceId` should be used as a key to save and load the shared data relevant to an application. This ensures that two users who are in the same application instance have access to the same shared data.

### Semantics of `instanceId`

Instance IDs are generated when a user launches an application. Any users joining the same application will receive the same `instanceId`. When all the users of an application in a channel leave or close the application, that instance has finished its lifecycle, and will not be used again. The next time a user opens the application in that channel, a new `instanceId` will be generated.
