# Backward Compatibility

## New Commands

When new commands become available in the embedded-app-sdk, those commands won't be supported by all Discord app versions. The new command will typically only be supported by newer Discord app versions. When an application tries to use a new command with an old Discord app version that doesn't support the command, the Discord app will respond with error code `INVALID_COMMAND` which the application can handle like this:

```javascript
try {
  const {permissions} = await discordSdk.commands.getChannelPermissions();

  // check permissions
  ...
} catch (error) {
  if (error.code = RPCErrorCodes.INVALID_COMMAND) {
    // This is an expected error. The Discord client doesn't support this command
    ...
  } else {
    // Unexpected error
    ...
  }
}
```
