# @discord/embedded-app-sdk

<p align="center">
  <img src="/assets/discord-embedded-apps.svg" alt="Discord Embedded App SDK" />
<p>

### The Embedded App SDK enables you to build rich, multiplayer experiences inside Discord.

Activities are multiplayer games and social experiences in Discord. An Activity is a web application hosted in an iframe that can run within the Discord client on desktop, web, or mobile. The Embedded App SDK handles the communication between Discord and your iframed application.

Read more about building Discord Activities with the Embedded App SDK on [https://discord.com/developers/docs/activities/overview](https://discord.com/developers/docs/activities/overview).

## Resources

- **[Embedded App SDK Docs](https://discord.com/developers/docs/developer-tools/embedded-app-sdk)** - Get familiar with the Embedded App SDK
- **[Activity Examples](/examples/)** - Explore examples of Discord Activities
- **[Technical chat on Discord](https://discord.com/invite/discord-developers)** - Join us and other devs at DDevs at `#activities-dev-help`

## Installing this package

```shell
npm install @discord/embedded-app-sdk
```

## Usage

To use the SDK, import it into your project and construct a new instance of the DiscordSDK class.

Below is a minimal example of setting up the SDK.
Visit [/examples/discord-activity-starter](/examples/discord-activity-starter/README.md) for a complete example application. See more info on environment variables (`YOUR_OAUTH2_CLIENT_ID`, etc...) [here](https://discord.com/developers/docs/activities/building-an-activity#find-your-oauth2-credentials).

```typescript
import {DiscordSDK} from '@discord/embedded-app-sdk';
const discordSdk = new DiscordSDK(YOUR_OAUTH2_CLIENT_ID);

async function setup() {
  // Wait for READY payload from the discord client
  await discordSdk.ready();

  // Pop open the OAuth permission modal and request for access to scopes listed in scope array below
  const {code} = await discordSdk.commands.authorize({
    client_id: YOUR_OAUTH2_CLIENT_ID,
    response_type: 'code',
    state: '',
    prompt: 'none',
    scope: ['identify'],
  });

  // Retrieve an access_token from your application's server
  const response = await fetch('/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
    }),
  });
  const {access_token} = await response.json();

  // Authenticate with Discord client (using the access_token)
  auth = await discordSdk.commands.authenticate({
    access_token,
  });
}
```

## SDK development

Developing a new feature or patching a bug on the SDK? Check out [this guide](/docs/local-sdk-development.md) to learn how to set up your local dev environment.

## Discord Developer Terms of Service & Developer Policy

Please note that while this SDK is licensed under the MIT License, the [Discord Developer Terms of Service](https://discord.com/developers/docs/policies-and-agreements/developer-terms-of-service) and [Discord Developer Policy](https://discord.com/developers/docs/policies-and-agreements/developer-policy) otherwise still apply to you and the applications you develop utilizing this SDK.
