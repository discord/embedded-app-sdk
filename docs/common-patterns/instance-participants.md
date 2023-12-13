# Instance Participants

Instance Participants are any Discord user actively connected to the same Application Instance. This data can be fetched or subscribed to.

```typescript
import {DiscordSDK, Events, type Types} from '@discord/embedded-app-sdk';

const discordSdk = new DiscordSDK('...');
await discordSdk.ready();

// Fetch
const participants = await discordSdk.commands.getInstanceConnectedParticipants();

// Subscribe
function updateParticipants(participants: Types.GetApplicationInstanceConnectedParticipantsResponse) {
  // Do something really cool
}
discordSdk.subscribe(Events.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE, updateParticipants);
// Unsubscribe
discordSdk.unsubscribe(Events.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE, updateParticipants);
```
