# Local SDK development

We have two example projects, which can be used to test the latest SDK release, as well as new changes to the SDK.

- [discord-application-starter](/examples/discord-application-starter) is a minimal application example
- [iframe-playground](/examples/iframe-playground) is a playground for testing any SDK functionality

These projects consume this repo's root `@discord/embedded-app-sdk` directly via [pnpm workspaces](https://pnpm.io/workspaces)

To test changes to the SDK, locally, with either of these projects, you must do the following:

1. From terminal, navigate to the root of either project's directory, (i.e. examples/discord-application-start or examples/iframe-playground)
2. Start up the example's web server with `pnpm dev`.
