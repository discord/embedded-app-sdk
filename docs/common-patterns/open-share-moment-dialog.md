# Open Share Moment Dialog

The easiest way for an application to share media to a channel or DM is to use the `openShareMomentDialog` command. This command accepts a Discord CDN `mediaUrl` (eg `https://cdn.discordapp.com/attachments/...`) and opens a dialog on the discord client that allows the user to select channels, DMs, and GDMs to share to. This requires no additional OAuth scopes, but does require the application to be authenticated.

![share-moment-dialog](/docs/assets/share-moment-dialog-example.png)

Since `mediaUrl` must be a Discord CDN URL, it is encouraged to use the activities attachment API endpoint (`discord.com/api/activities/${applicationId}/application`) to create an ephemeral CDN URL. This endpoint accepts bearer tokens for any scopes, so it can be called from the application client using the authorized user's bearer token. The endpointreturns a serialized attachment, which includes a `url` attribute, which should then be passed to the DiscordSDK command as `mediaUrl`.

# Usage

```ts
import {discordSdk} from './wherever-you-initialize-your-sdk';
import {accessToken} from './weherever-you-store-your-access-token';

// some image
const imageURL = 'https://i.imgur.com/vaSWuKr.gif';

// get image data
const response = await fetch(imageURL);
const blob = await response.blob();
const mimeType = blob.type;

// image data as buffer
const buf = await blob.arrayBuffer();

// image as file
const imageFile = new File([buf], 'example.gif', {type: mimeType});

const body = new FormData();
body.append('file', imageFile);

const attachmentResponse = await fetch(`${env.discordAPI}/activities/${env.applicationId}/attachment`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
  body,
});
const attachmentJson = await attachmentResponse.json();

// mediaUrl is an ephemeral Discord CDN URL
const mediaUrl = attachmentJson.attachment.url;

// opens dialog in Discord client
await discordSdk.commands.openShareMomentDialog({mediaUrl});
```
