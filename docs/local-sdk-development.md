# Local SDK development

We have two example projects, which can be used to test the latest SDK release, as well as new changes to the SDK.

- [discord-activity-starter](/examples/discord-activity-starter) is a minimal application example
- [sdk-playground](/examples/sdk-playground) is a playground for testing any SDK functionality

These projects consume this repo's root `@discord/embedded-app-sdk` directly via [pnpm workspaces](https://pnpm.io/workspaces)

To test changes to the SDK, locally, with either of these projects, you must do the following:

1. From terminal, navigate to the root of either project's directory, (i.e. examples/discord-application-start or examples/sdk-playground)
2. Start up the example's web server with `pnpm dev`.
3. Start up the SDK's development pipeline with `pnpm dev`.
