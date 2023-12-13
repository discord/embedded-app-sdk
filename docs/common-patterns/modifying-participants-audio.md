# Modifying Participants' Audio

The SDK allows modifying users' volume, panning, as well as muting/unmuting via the `setUserVoiceSettings` command. Several constraints to be considered:

- The user must grant your application the `rpc.voice.write` scope.
- The audio modifications can only be heard on that user's client (i.e. if you call `setUserVoiceSettings` on computer A, it will not modfy audio settings on computer B)
- The application should try to track each user's original voice state and clean up any changes when the application is closed.

Here is an example code snippet to show how a group of users' voices could be muted:

```ts
yourApplication.on('application-mute-event', (userIdsToBeMuted) => {
  userIdsToBeMuted.forEach((user_id) => {
    discordSdk.setUserVoiceSettings({
      user_id,
      mute: true,
    });
  });
});
```
