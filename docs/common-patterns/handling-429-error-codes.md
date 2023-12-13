# Handling 429 Error Codes

One very common obstacle when interacting with Discord's APIs is rate-limiting. As a prerequisite, please read our documentation on handling rate limiting [here](https://discord.com/developers/docs/topics/rate-limits#rate-limits).

## Common Pattern for handling 429 Error Codes

Check out [this example](/examples/discord-application-starter/packages/server/src/utils.ts) of how to respect the `retry_after` header when you receive a 429 error.
