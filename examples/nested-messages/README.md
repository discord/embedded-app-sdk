# Embedded app with Nested Messages

The `embedded-app-sdk` is intended for use by a single-page application. We recognize developers may be using frameworks or approaches that do not necessarily "fit into the bucket" of single-page applications, and wanted to provide some suggestions, specifically, we recommend nesting those frameworks inside of your embedded app's top-level single-page application and passing messages as you see fit. The developer recognizes that Discord may not be able to provide support, guidance, or code samples for communication required between your embedded app's top-level single-page applications and any frameworks you use inside of it.

This example shows how an embedded app with a nested framework, such as a iframe hosting a mutli-page-app, an iframe hosting a Unity App, or any other unique framework can be set up to work inside of a Discord embedded app iframe. We will create a parent website to mount the nested framework, hold state, and pass along messages between the Discord Client and the nested framework. This example is not meant to serve as a source-of-truth for how you should implement passing messages, instead it's a minimal example, which you could take inspiration from, or expand upon, based on your embedded app's needs.

## How to run

This embedded app depends on the embedded-app-sdk being built. To build the package, from the root of this repository run the following commands in your terminal.

```
pnpm install
pnpm build
```

### Set up your .env file

Copy/rename the [.example.env](/examples/nested-messages/.example.env) file to `.env`.
Fill in `CLIENT_ID` and `CLIENT_SECRET` with the OAuth2 Client ID and Client Secret, as described [here](/docs/setting-up-your-discord-application.md#oauth2).

To serve this embedded app locally, from terminal navigate to `/embedded-app-sdk/examples/nested-messages` and run the following:

```
pnpm install
pnpm dev
```

## Many ways to solve a puzzle

In this example, the core issue we're trying to solve is how to pass messages (commands, responses, and event subscriptions) between the Discord client and a nested framework inside of your embedded app. This example solves the puzzle by creating a `MessageInterface` class which looks very similar to `embedded-app-sdk`. This is for the following reasons:

1. It's also using javascript inside the nested iframe
2. It needs to solve many similar problems, such as passing events and listening for events that have been subscribed to.

Depending on your use-case, you may find an alternate solution to `MessageInterface` to be a better fit for your embedded app.

## Nested Messages architecture

### Routing

All client code is located in [/client](/examples/nested-messages/client/) and is served via a NodeJS Express server. Each route is provided by a `index.html` file. Each `index.html` file has a corresponding `index.ts` file and a (gitignored) compiled `index.js` file which is consumed by the html file. For example, let's consider the nested "embedded app", which is served at `/nested`. When a user visits this route, they are sent the file [client/nested/index.html](/examples/nested-messages/client/nested/index.html) which imports the compiled javascript from [client/nested/index.ts](/examples/nested-messages/client/nested/index.ts).

### Build tooling

All typescript files inside of the `client` directory can be compiled into javascript files by running `npm run build`. When developing, you can run `npm run dev` which will rebuild whenever a file-change is detected inside of the `client` directory.

### Routes

In this example, we have an embedded app which is nested inside of the parent "embedded app host". The embedded app host's responsibility is to initialize the SDK, listen for commands sent from the nested emvedded app, and pass along responses sent by the Discord client.

We have added a button to the nested embedded app which allows it to call `window.location.reload()` without invalidating the embedded app session.

### Nested message management

See [client/index.ts](/examples/nested-messages/client/index.ts) to learn more about the "how" of how this example supports nested embedded app messages.
