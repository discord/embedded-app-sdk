# Spatial voice

Spatial voice lets an Activity describe how members of the listener's current Discord voice channel should sound in the Activity's world. Discord continues to transport and mix voice; the Activity never receives microphone or decoded voice audio.

This API is capability-gated and initially available only in supported native Discord development clients. Always retain normal Discord voice as the fallback.

```ts
const capabilities = await discordSdk.spatialVoice.getCapabilities();
if (!capabilities.available) {
  // Keep the in-Activity control in Regular mode.
  return;
}

const session = await discordSdk.spatialVoice.createSession();
const stopSpeaking = await session.onSpeaking(({userId, speaking}) => {
  setSpeakingIndicator(userId, speaking);
});

await session.update({
  listener: {
    position: localPlayer.position,
    forward: localPlayer.forward,
  },
  sources: remotePlayers.map((player) => ({
    userId: player.discordUserId,
    position: player.position,
    gain: player.voiceGain,
    spatialBlend: player.useSpatialVoice ? 1 : 0,
  })),
});

// The Activity's Regular mode restores normal Discord mixing.
await session.suspend();

// Proximity mode reapplies the most recent snapshot.
await session.resume();

await stopSpeaking();
await session.close();
```

## Contract

- Positions are world-space coordinates. The listener's position and forward vector define the listening pose.
- `gain` is a transient multiplier from `0` to `1`; it composes with, and never replaces, the listener's saved Discord volume.
- `spatialBlend` ranges from `0` (regular mix) to `1` (fully spatial).
- Omit voice-channel members who should remain on Discord's regular mix.
- Send complete source snapshots. Coalesce movement updates to `maxUpdatesPerSecond` and never exceed `maxSources`.
- `initialParticipants` is the roster captured at session creation. Call `session.getParticipants()` for a fresh roster.
- `session.onSpeaking()` returns an async unsubscribe function and combines Discord's speaking-start/stop events into one boolean callback.
- `suspend()`, `resume()`, speaking cleanup, and `close()` are idempotent. Always close the session during Activity teardown or an unrecoverable error.

Room size, reflections, normalized voice levels, raw PCM, microphone capture, and control of other listeners are not part of the initial capability.
