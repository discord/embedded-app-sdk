## postMessage Protocol

Since `postMessage` is not a connection with a distinct start/end life-time, there is a protocol you must use that mocks a socket connection. I will describe it below:

```
enum OPCODES {
  HANDSHAKE = 0,
  FRAME = 1,
  CLOSE = 2,
  HELLO = 3
}
```

`postMessage` messages should be structured as follows:

`[OPCODE, data]`

Here&#39;s the flow:

1.) When your iFrame mounts in Discord, it includes query parameters in its url which are distinct to your application's instance. These query parameters are captured by the SDK and can be refereced by the constructed SDK object.

2.) Constructing the SDK will initiate a handshake with the Discord Client. Once a connection with the Discord Client is established, the iframe will receive a `[FRAME, {evt: 'READY', ...}]` The READY payload is described [here](https://discord.com/developers/docs/topics/rpc#ready). The SDK instance exposes an asynchronous `ready()` method which will resolve when the SDK has established the connection with the Discord client.

3.) Your first commands, once receiving the `READY` payload, should be `authorize` and `authenticate` (as described in the code and diagram above) to allow using any scopes your application requires. All activities require at least the `rpc.activities.write` scope.

4.) Once authenticated, your application can subscribe to events from and send commands to the Discord Client. Calling any commands or event subscriptions that you do not have scope for will result in that command returning an error. If your application adds any scopes, it will trigger the OAuth modal to re-request the user for permission.

```
enum RPCCloseCodes {
  CLOSE_NORMAL = 1000,
  CLOSE_UNSUPPORTED = 1003,
  CLOSE_ABNORMAL = 1006,
  INVALID_CLIENTID = 4000,
  INVALID_ORIGIN = 4001,
  RATELIMITED = 4002,
  TOKEN_REVOKED = 4003,
  INVALID_VERSION = 4004,
  INVALID_ENCODING = 4005,
}
```

5.) If you receive a `[CLOSE, {message: string, code: number}]` at any time, there has probably been an error and you must start the &quot;connection&quot; from the beginning.

6.) To communicate an error to the Discord client, or to ask Discord to close your game, send your own `[CLOSE, {message?: string, code: number}]` . Any code but `CLOSE_NORMAL` will cause the message to be surfaced to the user, otherwise it will close silently.
