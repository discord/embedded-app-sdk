# Rivet Asteroids Example

This repo contains an example of a fully multiplayer game running as a Discord activity via [Rivet](https://rivet.gg/)'s gaming infrastructure that lets you host your game in just two commands.

## Client architecture

-   ViteJS

## Server architecture

-   Express
-   Socket.io

## Setting up your Discord Application

Before we write any code, lets follow the instructions [here](https://discord.com/developers/docs/activities/building-an-activity#step-1-creating-a-new-app) to make sure your Discord application is set up correctly.

## Setting up your environment variables

In this directory (`/examples/asteroids-rivet`) we need to create a `.env` file with the OAuth2 variables, as described [here](https://discord.com/developers/docs/activities/building-an-activity#find-your-oauth2-credentials).

```env
DISCORD_CLIENT_ID=123456789012345678
DISCORD_CLIENT_SECRET=abcdefghijklmnopqrstuvwxyzabcdef
```

## Running your app locally

### Deploying your game

First, we deploy the game to Rivet with the Rivet CLI. See how to install the Rivet CLI [here](https://github.com/rivet-gg/cli?tab=readme-ov-file#installation).

After installation, run this command to get your project linked to Rivet Cloud. You will be asked to sign in and create a game to link to.

```sh
rivet init
```

Next, we can deploy to Rivet:

```sh
rivet deploy prod
```

If successful, you should see a message in your terminal that looks like so:

```
Deploy Succeeded https://asteroids-xxx.rivet.game/
```

### Updating your URL mappings

Using the URL of the successfully deployed game, you can update your activity's URL mappings to match like so:

![Screenshot of the configured URL mappings](/assets/rivet-url-mappings.png)

**Important:** The other URL bindings are required for API requests to Rivet.

### Playing Asteroids

Finally, you can follow the guide [here](https://discord.com/developers/docs/activities/building-an-activity#enable-developer-mode-in-your-client) on getting the activity running in Discord.

![Screenshot of the Rivet Asteroids demo](/assets/rivet-asteroids.png)
