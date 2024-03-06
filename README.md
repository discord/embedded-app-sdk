# @discord/embedded-app-sdk

<p align="center">
  <img src="/assets/discord-embedded-apps.svg" alt="Discord Embedded App SDK" />
<p>

This library enables communication between your Application and Discord. Whether launched via Discord's web app, desktop app, iOS, or Android, `@discord/embedded-app-sdk` provides a unified API that enables your application to integrate a real-time website inside of Discord's UI via an embedded iframe.

- [Installing this package](#installing-this-package)
- [SDK development](#sdk-development)

## Installing this package

TODO - remove `github:` prefix once public npm package is available

```shell
npm install github:@discord/embedded-app-sdk
```

## Usage

To use the SDK, import it into your project and construct a new instance of the DiscordSDK class.

Below is a minimal example of setting up the SDK.
Visit [/examples/discord-embedded-app-starter](/examples/discord-embedded-app-starter/README.md) for a complete example application. See more info on environment variables (`YOUR_OAUTH2_CLIENT_ID`, etc...) [here](https://activities-preview.pages.dev/developers/docs/embedded-apps/getting-started#find-your-oauth2-credentials).

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

Developing a new feature or patching a bug on the SDK? Check out [this guide](/docs/common-patterns/local-sdk-development.md) to learn how to set up your local dev environment.

## Discord Developer Terms of Service & Developer Policy

Please note that while this SDK is licensed under the MIT License, the [Discord Developer Terms of Service](https://discord.com/developers/docs/policies-and-agreements/developer-terms-of-service) and [Discord Developer Policy](https://discord.com/developers/docs/policies-and-agreements/developer-policy) otherwise still apply to you and the applications you develop utilizing this SDK.
