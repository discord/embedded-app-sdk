# React Colyseus Example

![Screenshot of the react colyseus example running](/assets/example-application.gif)

This repo is an example built on top of two javascript frameworks

1. [ReactJS](https://reactjs.org/) - A frontend javascript UI framework
2. [Colyseus](https://www.colyseus.io/) - A full-stack state-management library

## Client architecture

The client (aka front-end) is using [ViteJS](https://vitejs.dev/)'s React Typescript starter project. Vite has great starter projects in [many common javascript frameworks](https://vitejs.dev/guide/#trying-vite-online). All of these projects use the same config setup, which means that if you prefer VanillaJS, Svelte, etc... you can swap frameworks and still get the following:

- Fast typescript bundling with hot-module-reloading
- Identical configuration API
- Identical environment variable API

## Server architecture

The server (aka back-end) is using Express with typescript. Any file in the server project can be imported by the client, in case you need to share business logic.

## Colyseus

We're going to manage and synchronize our embedded app's state via [Colyseus](https://www.colyseus.io/). Our server is stateful and will hold the source of truth for our embedded app, and each client will post messages to the server to modify this state. ⚠️ This example is not (yet) architected to scale to production. It is meant for rapid prototyping and to showcase common SDK and API patterns.

## Setting up your Discord Application

Before we write any code, lets follow the instructions [here](https://discord.com/developers/docs/activities/building-an-activity#step-1-creating-a-new-app) to make sure your Discord application is set up correctly.

## Setting up your environment variables

In order to run your app, you will need to create a `.env` file. Rename the file [/examples/react-colyseus/example.env](/examples/react-colyseus/example.env) to `.env` and fill it in with the appropriate OAuth2 variables. The OAuth2 variables can be found in the OAuth2 tab on the developer portal, as described [here](https://discord.com/developers/docs/activities/building-an-activity#find-your-oauth2-credentials)

```.env
# Example .env file
# Rename this from example.env to .env
VITE_CLIENT_ID=PASTE_OAUTH2_CLIENT_ID_HERE
CLIENT_SECRET=PASTE_OAUTH2_CLIENT_SECRET_HERE
```

## Running your app locally

As described [here](https://discord.com/developers/docs/activities/building-an-activity#step-4-running-your-app-locally-in-discord), we encourage using a tunnel solution such as [cloudflared](https://github.com/cloudflare/cloudflared#installing-cloudflared) for local development.
To run your app locally, run the following from this directory (/examples/react-colyseus)

```
pnpm install # only need to run this the first time
pnpm dev
pnpm tunnel # from another terminal
```

Be sure to complete all the steps listed [here](https://discord.com/developers/docs/activities/building-an-activity) to ensure your development setup is working as expected.

## Where do you go from here?

This basic example will render users' avatars and show a green circle around anyone who is talking. It will spin up one "room" per Discord voice channel. It's a great starting point for your app, whether you're planning to stay in "react-land" or planning to use Unity / Cocos / etc...

For more resources on 3rd party Game Engine SDKs for colyseus go [here](https://github.com/colyseus/colyseus#%EF%B8%8F-official-client-integration)

## Common patterns with Colyseus

### Expanding state

Let's say you wanted to add position (x, y) to each player, and allow them to move. This requires changes across the front-end and back-end. Here's an example of how to do that:

- Extend `Player.ts`' schema to include x and y as numbers

```diff
--- a/examples/react-colyseus/packages/server/src/entities/Player.ts
+++ b/examples/react-colyseus/packages/server/src/entities/Player.ts
@@ -1,6 +1,6 @@
 import {Schema, type} from '@colyseus/schema';

-export type TPlayerOptions = Pick<Player, 'sessionId' | 'userId' | 'name' | 'avatarUri' | 'talking'>;
+export type TPlayerOptions = Pick<Player, 'sessionId' | 'userId' | 'name' | 'avatarUri' | 'talking' | 'x' | 'y'>;

 export class Player extends Schema {
   @type('string')
@@ -18,6 +18,12 @@ export class Player extends Schema {
   @type('boolean')
   public talking: boolean = false;

+  @type('number')
+  public x: number;
+
+  @type('number')
+  public y: number;
+
   // Init
   constructor({name, userId, avatarUri, sessionId}: TPlayerOptions) {
     super();
@@ -25,5 +31,7 @@ export class Player extends Schema {
     this.avatarUri = avatarUri;
     this.name = name;
     this.sessionId = sessionId;
+    this.x = Math.round(Math.random() * 1000);
+    this.y = Math.round(Math.random() * 1000);
   }
 }
```

- Add a keyboard event listener which will send "move" commands to the server when arrow keys are pressed

```diff
--- a/examples/react-colyseus/packages/client/src/components/VoiceChannelActivity.tsx
+++ b/examples/react-colyseus/packages/client/src/components/VoiceChannelActivity.tsx
@@ -2,9 +2,41 @@ import * as React from 'react';
 import {Player} from './Player';
 import {usePlayers} from '../hooks/usePlayers';
 import './VoiceChannelActivity.css';
+import {useAuthenticatedContext} from '../hooks/useAuthenticatedContext';

 export function VoiceChannelActivity() {
   const players = usePlayers();
+  const {room} = useAuthenticatedContext();
+
+  React.useEffect(() => {
+    function handleKeyDown(ev: KeyboardEvent) {
+      switch (ev.key) {
+        case 'ArrowUp':
+        case 'KeyW':
+          room.send('move', {x: 0, y: 1});
+          break;
+        case 'ArrowDown':
+        case 'KeyS':
+          room.send('move', {x: 0, y: -1});
+          break;
+        case 'ArrowLeft':
+        case 'KeyA':
+          room.send('move', {x: -1, y: 0});
+          break;
+        case 'ArrowRight':
+        case 'KeyD':
+          room.send('move', {x: 1, y: 0});
+          break;
+        default:
+          break;
+      }
+    }
+
+    document.addEventListener('keydown', handleKeyDown);
+    return () => {
+      document.removeEventListener('keydown', handleKeyDown);
+    };
+  }, [room]);

   return (
     <div className="voice__channel__container">
```

- Create an event listener on `StateHandlerRoom.ts` to handle "move" events coming from clients

```diff
--- a/examples/react-colyseus/packages/server/src/rooms/StateHandlerRoom.ts
+++ b/examples/react-colyseus/packages/server/src/rooms/StateHandlerRoom.ts
@@ -16,6 +16,10 @@ export class StateHandlerRoom extends Room<State> {
     this.onMessage('stopTalking', (client, _data) => {
       this.state.stopTalking(client.sessionId);
     });
+
+    this.onMessage('move', (client, data) => {
+      this.state.movePlayer(client.sessionId, data);
+    });
   }

   onAuth(_client: any, _options: any, _req: any) {
```

- Create a command to allow moving a player in `State.ts`

```diff
--- a/examples/react-colyseus/packages/server/src/entities/State.ts
+++ b/examples/react-colyseus/packages/server/src/entities/State.ts
@@ -56,4 +56,15 @@ export class State extends Schema {
       player.talking = false;
     }
   }
+
+  movePlayer(sessionId: string, movement: {x: number; y: number}) {
+    const player = this._getPlayer(sessionId);
+    if (player != null) {
+      if (movement.x) {
+        player.x += movement.x;
+      } else if (movement.y) {
+        player.y += movement.y;
+      }
+    }
+  }
 }
```

- Update the UI to consume the stateful updates to each player

```diff
--- a/examples/react-colyseus/packages/client/src/components/Player.tsx
+++ b/examples/react-colyseus/packages/client/src/components/Player.tsx
@@ -2,13 +2,15 @@ import * as React from 'react';
 import {TPlayerOptions} from 'server/src/entities/Player';
 import './Player.css';

-export function Player({avatarUri, name, talking}: TPlayerOptions) {
+export function Player({avatarUri, name, talking, x, y}: TPlayerOptions) {
   return (
     <div className="player__container">
       <div className={`player__avatar ${talking ? 'player__avatar__talking' : ''}`}>
         <img className="player__avatar__img" src={avatarUri} width="100%" height="100%" />
       </div>
-      <div>{name}</div>
+      <div>
+        {x}, {y}, {name}
+      </div>
     </div>
   );
 }
```

### Adding a new environment variable

In order to add new environment variables, you will need to do the following:

1. Add the environment key and value to `.env`
2. Add the key to [/examples/react-colyseus/packages/client/src/vite-env.d.ts](/examples/react-colyseus/packages/client/src/vite-env.d.ts)
3. Add the key to [/examples/react-colyseus/packages/server/environment.d.ts](/examples/react-colyseus/packages/server/environment.d.ts)

This will ensure that you have type safety in your client and server code when consuming environment variables

Per the [ViteJS docs](https://vitejs.dev/guide/env-and-mode.html#env-files)

> To prevent accidentally leaking env variables to the client, only variables prefixed with VITE\_ are exposed to your Vite-processed code.

```env
# Example .env file
VITE_CLIENT_ID=123456789012345678
CLIENT_SECRET=abcdefghijklmnopqrstuvwxyzabcdef
```
