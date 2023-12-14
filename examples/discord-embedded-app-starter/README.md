# Discord Embedded App Starter

This repo is a minimal starter-project. Getting an embedded app running in Discord can be complex. The goal of this example is to get you up-and-running as quickly as possible, while making it easy to swap in pieces to fit your embedded app's client and server needs.

## Client architecture

The client (aka front-end) is using [ViteJS](https://vitejs.dev/)'s Vanilla Typescript starter project. Vite has great starter projects in [many common javascript frameworks](https://vitejs.dev/guide/#trying-vite-online). All of these projects use the same config setup, which means that if you prefer React, Svelte, etc... you can swap frameworks and still get the following:

- Fast typescript bundling with hot-module-reloading
- Identical configuration API
- Identical environment variable API

Note: ViteJS is not required to use Discord's `embedded-app-sdk`. ViteJS is a meta-client-framework we are using to make it easy to help you get running quickly, but the core concepts of developing an embedded application are the same, regardless of how you are consuming `embedded-app-sdk`.

## Server architecture

The server (aka back-end) is using Express with typescript. Any file in the server project can be imported by the client, in case you need to share business logic.

## Setting up your Discord Application

Before we write any code, lets follow the instructions [here](/docs/setting-up-your-discord-application.md) to make sure your Discord application is set up correctly.

## Setting up your environment variables

In this directory (`/examples/discord-embedded-app-starter`) we need to create a `.env` file with the OAuth2 variables, as described [here](/docs/setting-up-your-discord-application.md#oauth2).

```env
VITE_CLIENT_ID=123456789012345678
CLIENT_SECRET=abcdefghijklmnopqrstuvwxyzabcdef
```

### Adding a new environment variable

In order to add new environment variables, you will need to do the following:

1. Add the environment key and value to `.env`
2. Add the key to [/examples/discord-embedded-app-starter/packages/client/src/vite-env.d.ts](/examples/discord-embedded-app-starter/packages/client/src/vite-env.d.ts)
3. Add the key to [/examples/discord-embedded-app-starter/packages/server/environment.d.ts](/examples/discord-embedded-app-starter/packages/server/environment.d.ts)

This will ensure that you have type safety when consuming your environment variables

## Running your app locally

As described in [running-your-application.md](/docs/common-patterns/running-your-application.md#running-an-application-through-a-network-tunnel), we encourage using a tunnel solution such as [cloudflared](https://github.com/cloudflare/cloudflared#installing-cloudflared) for local development.
To run this example app locally, first run `pnpm install` from the root of the `/embedded-app-sdk` directory. Then run the following from the root of this example project's directory (/embedded-app-sdk/examples/discord-embedded-app-starter)

```
pnpm dev
cloudflared tunnel --url http://localhost:3000 # You will need to run this in a separate terminal window
```

Be sure to complete all the steps listed [here](/docs/common-patterns/running-your-application.md#running-an-application-through-a-network-tunnel) to ensure your development setup is working as expected.
