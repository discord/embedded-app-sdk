# IFrame Playground

## Tech Stack

This repo is an example built on top of the following frameworks

1. [ReactJS](https://reactjs.org/) - A frontend javascript UI framework
2. [Cloudflare Workers](https://developers.cloudflare.com/workers/) - A serverless execution environment

## Client architecture

The client (aka front-end) is using [ViteJS](https://vitejs.dev/)'s React Typescript starter project. Vite has great starter projects in [many common javascript frameworks](https://vitejs.dev/guide/#trying-vite-online). All of these projects use the same config setup, which means that if you prefer VanillaJS, Svelte, etc... you can swap frameworks and still get the following:

- Fast typescript bundling with hot-module-reloading
- Identical configuration API
- Identical environment variable API

## Server architecture

The server (aka back-end) is using Cloudflare workers with typescript. Any file in the server project can be imported by the client, in case you need to share business logic.

## Setting up your Discord Application

Before we write any code, lets follow the instructions [here](https://github.com/discord/embedded-app-sdk/blob/main/docs/setting-up-your-discord-application.md) to make sure your Discord application is set up correctly.

![oauth2-details](https://github.com/discord/embedded-app-sdk/blob/main/docs/assets/oauth2-details.png)

## Running your app locally

As described in [running-your-application.md](/docs/common-patterns/running-your-application.md#running-an-application-through-a-network-tunnel), we encourage using a tunnel solution such as [cloudflared](https://github.com/cloudflare/cloudflared#installing-cloudflared) for local development.
To run your app locally, run the following from this directory (/examples/iframe-playground)

```
pnpm install # only need to run this the first time
pnpm dev
pnpm tunnel # from another terminal
```

Be sure to complete all the steps listed [here](/docs/common-patterns/running-your-application.md#running-an-application-through-a-network-tunnel) to ensure your development setup is working as expected.

### Adding a new environment variable

In order to add new environment variables, you will need to do the following:

1. Add the environment key and value to `.env`
2. Add the key to [/packages/client/src/vite-env.d.ts](/packages/client/src/vite-env.d.ts)
3. Add the key to [/packages/server/src/types.ts](/packages/server/src/types.ts)

This will ensure that you have type safety in your client and server code when consuming environment variables

Per the [ViteJS docs](https://vitejs.dev/guide/env-and-mode.html#env-files)

> To prevent accidentally leaking env variables to the client, only variables prefixed with VITE\_ are exposed to your Vite-processed code.

```env
# Example .env file
VITE_CLIENT_ID=123456789012345678
CLIENT_SECRET=abcdefghijklmnopqrstuvwxyzabcdef # This should be the application oauth2 token from the developer poortal.
BOT_TOKEN=bot_token
```

See [/docs/setting-up-your-discord-application.md](/docs/setting-up-your-discord-application.md) for instructions on getting the oauth2 token and the bot token.

# Manual Deployment

Steps to manually deploy the embedded app 0. Have access to the Discord Dev cloudflare account

1. Log into cloudflare with your credentials associated with Discord Dev

```sh
wrangler login
```

2. Create or verify .env.production file
   If you haven't made it yet, copy the example.env file, rename it to `.env.production`, and add the `VITE_CLIENT_ID` and `CLIENT_SECRET` variables

3. Build and deploy the client

```
cd packages/client
npm run build
CLOUDFLARE_ACCOUNT_ID=867c81bb01731ca0dfff534a58ce67d7 npx wrangler pages publish dist
```

4. Build and deploy the server

```
cd packages/server
npm run deploy
```
