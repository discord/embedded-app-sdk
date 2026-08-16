import {DiscordSDKMock, Events} from '../index';

const capabilities = {
  available: true,
  source_positioning: true,
  source_gain: true,
  source_spatial_blend: true,
  listener_pose: true,
  room_size: false,
  reflections: false,
  binary_speaking: true,
  max_sources: 50,
  max_updates_per_second: 20,
};

const participant = {
  user_id: 'user-1',
  username: 'cody',
  global_name: 'Cody',
  avatar: null,
  mute: false,
  deaf: false,
  self_mute: false,
  self_deaf: false,
  speaking: false,
};

function createSdk() {
  return new DiscordSDKMock('client-id', 'guild-id', 'channel-id', null);
}

describe('SpatialVoice', () => {
  it('maps capabilities and participants to the public SDK shape', async () => {
    const sdk = createSdk();
    sdk._updateCommandMocks({
      getSpatialVoiceCapabilities: () => Promise.resolve(capabilities),
      getSpatialVoiceParticipants: () => Promise.resolve({participants: [participant]}),
    });

    await expect(sdk.spatialVoice.getCapabilities()).resolves.toEqual({
      available: true,
      sourcePositioning: true,
      sourceGain: true,
      sourceSpatialBlend: true,
      listenerPose: true,
      roomSize: false,
      reflections: false,
      binarySpeaking: true,
      maxSources: 50,
      maxUpdatesPerSecond: 20,
    });
    await expect(sdk.spatialVoice.getParticipants()).resolves.toEqual([
      {
        userId: 'user-1',
        username: 'cody',
        globalName: 'Cody',
        avatar: null,
        mute: false,
        deaf: false,
        selfMute: false,
        selfDeaf: false,
        speaking: false,
      },
    ]);
  });

  it('owns a session and converts snapshots to the low-level RPC contract', async () => {
    const sdk = createSdk();
    const update = jest.fn().mockResolvedValue({success: true});
    const suspend = jest.fn().mockResolvedValue({success: true});
    const resume = jest.fn().mockResolvedValue({success: true});
    const stop = jest.fn().mockResolvedValue({success: true});
    sdk._updateCommandMocks({
      startSpatialVoiceSession: () =>
        Promise.resolve({
          session_id: 'session-id',
          channel_id: 'voice-channel-id',
          capabilities,
          participants: [participant],
        }),
      updateSpatialVoiceSession: update,
      suspendSpatialVoiceSession: suspend,
      resumeSpatialVoiceSession: resume,
      stopSpatialVoiceSession: stop,
    });

    const session = await sdk.spatialVoice.createSession();
    expect(session.id).toBe('session-id');
    expect(session.channelId).toBe('voice-channel-id');
    expect(session.initialParticipants[0].userId).toBe('user-1');

    await session.update({
      listener: {
        position: {x: 1, y: 2, z: 3},
        forward: {x: 0, y: 0, z: -1},
      },
      sources: [
        {
          userId: 'user-1',
          position: {x: 4, y: 5, z: 6},
        },
      ],
    });
    expect(update).toHaveBeenCalledWith({
      session_id: 'session-id',
      listener: {
        position: {x: 1, y: 2, z: 3},
        forward: {x: 0, y: 0, z: -1},
      },
      sources: [
        {
          user_id: 'user-1',
          position: {x: 4, y: 5, z: 6},
          gain: 1,
          spatial_blend: 1,
        },
      ],
    });

    await session.suspend();
    await session.suspend();
    expect(suspend).toHaveBeenCalledTimes(1);
    expect(session.isSuspended).toBe(true);

    await session.resume();
    await session.resume();
    expect(resume).toHaveBeenCalledTimes(1);
    expect(session.isSuspended).toBe(false);

    await session.close();
    await session.close();
    expect(stop).toHaveBeenCalledTimes(1);
    expect(session.isClosed).toBe(true);
  });

  it('combines speaking start and stop into one scoped callback and cleans it up', async () => {
    const sdk = createSdk();
    const stop = jest.fn().mockResolvedValue({success: true});
    sdk._updateCommandMocks({
      startSpatialVoiceSession: () =>
        Promise.resolve({
          session_id: 'session-id',
          channel_id: 'voice-channel-id',
          capabilities,
          participants: [],
        }),
      stopSpatialVoiceSession: stop,
    });
    const unsubscribe = jest.spyOn(sdk, 'unsubscribe');
    const session = await sdk.spatialVoice.createSession();
    const listener = jest.fn();

    await session.onSpeaking(listener);
    sdk.emitEvent(Events.SPEAKING_START, {channel_id: 'voice-channel-id', user_id: 'user-1'});
    sdk.emitEvent(Events.SPEAKING_STOP, {channel_id: 'voice-channel-id', user_id: 'user-1'});
    expect(listener).toHaveBeenNthCalledWith(1, {userId: 'user-1', speaking: true});
    expect(listener).toHaveBeenNthCalledWith(2, {userId: 'user-1', speaking: false});

    await session.close();
    expect(unsubscribe).toHaveBeenCalledTimes(2);
    sdk.emitEvent(Events.SPEAKING_START, {channel_id: 'voice-channel-id', user_id: 'user-1'});
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('coalesces concurrent session creation', async () => {
    const sdk = createSdk();
    const start = jest.fn().mockResolvedValue({
      session_id: 'session-id',
      channel_id: 'voice-channel-id',
      capabilities,
      participants: [],
    });
    sdk._updateCommandMocks({
      startSpatialVoiceSession: start,
      stopSpatialVoiceSession: () => Promise.resolve({success: true}),
    });

    const [first, second] = await Promise.all([sdk.spatialVoice.createSession(), sdk.spatialVoice.createSession()]);
    expect(first).toBe(second);
    expect(start).toHaveBeenCalledTimes(1);
    await first.close();
  });
});
