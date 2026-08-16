import type {IDiscordSDK} from './interface';
import {Events} from './schema/events';
import type {
  GetSpatialVoiceCapabilitiesResponse,
  GetSpatialVoiceParticipantsResponse,
  StartSpatialVoiceSessionResponse,
  UpdateSpatialVoiceSessionRequest,
} from './generated/schemas';

type SpatialVoiceTransport = Pick<IDiscordSDK, 'commands' | 'subscribe' | 'unsubscribe'>;
type RawCapabilities = GetSpatialVoiceCapabilitiesResponse;
type RawParticipant = GetSpatialVoiceParticipantsResponse['participants'][number];
type RawListener = UpdateSpatialVoiceSessionRequest['listener'];

export interface SpatialVoiceVector3 {
  x: number;
  y: number;
  z: number;
}

export interface SpatialVoiceListener {
  position: SpatialVoiceVector3;
  forward: SpatialVoiceVector3;
}

export interface SpatialVoiceSource {
  userId: string;
  position: SpatialVoiceVector3;
  gain?: number;
  spatialBlend?: number;
}

export interface SpatialVoiceUpdate {
  listener: SpatialVoiceListener;
  sources: SpatialVoiceSource[];
}

export interface SpatialVoiceCapabilities {
  available: boolean;
  sourcePositioning: boolean;
  sourceGain: boolean;
  sourceSpatialBlend: boolean;
  listenerPose: boolean;
  roomSize: boolean;
  reflections: boolean;
  binarySpeaking: boolean;
  participantUpdates: boolean;
  maxSources: number;
  maxUpdatesPerSecond: number;
}

export interface SpatialVoiceParticipant {
  userId: string;
  username: string;
  globalName: string | null;
  avatar: string | null;
  mute: boolean;
  deaf: boolean;
  selfMute: boolean;
  selfDeaf: boolean;
  speaking: boolean;
}

export interface SpatialVoiceSpeakingEvent {
  userId: string;
  speaking: boolean;
}

export interface SpatialVoiceSpeakingTransitionEvent {
  userId: string;
}

export type SpatialVoiceSpeakingListener = (event: SpatialVoiceSpeakingEvent) => void;
export type SpatialVoiceSpeakingTransitionListener = (event: SpatialVoiceSpeakingTransitionEvent) => void;
export type SpatialVoiceParticipantsListener = (participants: SpatialVoiceParticipant[]) => void;
export type SpatialVoiceSpeakingUnsubscribe = () => Promise<void>;
export type SpatialVoiceParticipantsUnsubscribe = () => Promise<void>;

function mapCapabilities(capabilities: RawCapabilities): SpatialVoiceCapabilities {
  return {
    available: capabilities.available,
    sourcePositioning: capabilities.source_positioning,
    sourceGain: capabilities.source_gain,
    sourceSpatialBlend: capabilities.source_spatial_blend,
    listenerPose: capabilities.listener_pose,
    roomSize: capabilities.room_size,
    reflections: capabilities.reflections,
    binarySpeaking: capabilities.binary_speaking,
    participantUpdates: capabilities.participant_updates,
    maxSources: capabilities.max_sources,
    maxUpdatesPerSecond: capabilities.max_updates_per_second,
  };
}

function mapParticipant(participant: RawParticipant): SpatialVoiceParticipant {
  return {
    userId: participant.user_id,
    username: participant.username,
    globalName: participant.global_name,
    avatar: participant.avatar,
    mute: participant.mute,
    deaf: participant.deaf,
    selfMute: participant.self_mute,
    selfDeaf: participant.self_deaf,
    speaking: participant.speaking,
  };
}

export class SpatialVoiceSession {
  readonly id: string;
  readonly channelId: string;
  readonly capabilities: SpatialVoiceCapabilities;
  readonly initialParticipants: SpatialVoiceParticipant[];

  private suspended = false;
  private closed = false;
  private closePromise: Promise<void> | null = null;
  private readonly unsubscribers = new Set<() => Promise<void>>();

  /** @internal Sessions are created through `discordSdk.spatialVoice.createSession()`. */
  constructor(
    private readonly sdk: SpatialVoiceTransport,
    response: StartSpatialVoiceSessionResponse,
    private readonly onClose: () => void,
  ) {
    this.id = response.session_id;
    this.channelId = response.channel_id;
    this.capabilities = mapCapabilities(response.capabilities);
    this.initialParticipants = response.participants.map(mapParticipant);
  }

  get isSuspended(): boolean {
    return this.suspended;
  }

  get isClosed(): boolean {
    return this.closed;
  }

  async getParticipants(): Promise<SpatialVoiceParticipant[]> {
    this.assertOpen();
    const response = await this.sdk.commands.getSpatialVoiceParticipants(undefined);
    return response.participants.map(mapParticipant);
  }

  async update({listener, sources}: SpatialVoiceUpdate): Promise<void> {
    this.assertOpen();
    await this.sdk.commands.updateSpatialVoiceSession({
      session_id: this.id,
      listener: listener as RawListener,
      sources: sources.map((source) => ({
        user_id: source.userId,
        position: source.position,
        gain: source.gain ?? 1,
        spatial_blend: source.spatialBlend ?? 1,
      })),
    });
  }

  async suspend(): Promise<void> {
    this.assertOpen();
    if (this.suspended) return;
    await this.sdk.commands.suspendSpatialVoiceSession({session_id: this.id});
    this.suspended = true;
  }

  async resume(): Promise<void> {
    this.assertOpen();
    if (!this.suspended) return;
    await this.sdk.commands.resumeSpatialVoiceSession({session_id: this.id});
    this.suspended = false;
  }

  async onSpeaking(listener: SpatialVoiceSpeakingListener): Promise<SpatialVoiceSpeakingUnsubscribe> {
    this.assertOpen();
    if (!this.capabilities.binarySpeaking) {
      throw new Error('Binary speaking events are not supported by this client');
    }

    const unsubscribeStart = await this.onSpeakingStart(({userId}) => listener({userId, speaking: true}));
    try {
      const unsubscribeStop = await this.onSpeakingStop(({userId}) => listener({userId, speaking: false}));
      let active = true;
      return async () => {
        if (!active) return;
        active = false;
        await Promise.all([unsubscribeStart(), unsubscribeStop()]);
      };
    } catch (error) {
      await unsubscribeStart();
      throw error;
    }
  }

  async onSpeakingStart(listener: SpatialVoiceSpeakingTransitionListener): Promise<SpatialVoiceSpeakingUnsubscribe> {
    if (!this.capabilities.binarySpeaking) {
      throw new Error('Binary speaking events are not supported by this client');
    }
    return await this.subscribeToSpeakingEvent(Events.SPATIAL_VOICE_SPEAKING_START, listener);
  }

  async onSpeakingStop(listener: SpatialVoiceSpeakingTransitionListener): Promise<SpatialVoiceSpeakingUnsubscribe> {
    if (!this.capabilities.binarySpeaking) {
      throw new Error('Binary speaking events are not supported by this client');
    }
    return await this.subscribeToSpeakingEvent(Events.SPATIAL_VOICE_SPEAKING_STOP, listener);
  }

  async onParticipantsChanged(
    listener: SpatialVoiceParticipantsListener,
  ): Promise<SpatialVoiceParticipantsUnsubscribe> {
    this.assertOpen();
    if (!this.capabilities.participantUpdates) {
      throw new Error('Spatial voice participant updates are not supported by this client');
    }

    const onUpdate = ({participants}: {participants: RawParticipant[]}) => listener(participants.map(mapParticipant));
    const args = {session_id: this.id};
    await this.sdk.subscribe(Events.SPATIAL_VOICE_PARTICIPANTS_UPDATE, onUpdate, args);
    if (this.closed) {
      await this.sdk.unsubscribe(Events.SPATIAL_VOICE_PARTICIPANTS_UPDATE, onUpdate, args);
      throw new Error('Spatial voice session is closed');
    }
    return this.trackUnsubscriber(async () => {
      await this.sdk.unsubscribe(Events.SPATIAL_VOICE_PARTICIPANTS_UPDATE, onUpdate, args);
    });
  }

  close(): Promise<void> {
    this.closePromise ??= this.closeInternal();
    return this.closePromise;
  }

  private async closeInternal(): Promise<void> {
    this.closed = true;
    const unsubscribers = [...this.unsubscribers];
    this.unsubscribers.clear();
    await Promise.allSettled(unsubscribers.map((unsubscribe) => unsubscribe()));
    try {
      await this.sdk.commands.stopSpatialVoiceSession({session_id: this.id});
    } finally {
      this.onClose();
    }
  }

  private assertOpen(): void {
    if (this.closed || this.closePromise != null) {
      throw new Error('Spatial voice session is closed');
    }
  }

  private async subscribeToSpeakingEvent(
    event: Events.SPATIAL_VOICE_SPEAKING_START | Events.SPATIAL_VOICE_SPEAKING_STOP,
    listener: SpatialVoiceSpeakingTransitionListener,
  ): Promise<SpatialVoiceSpeakingUnsubscribe> {
    this.assertOpen();
    const onEvent = ({user_id}: {user_id: string}) => listener({userId: user_id});
    const args = {session_id: this.id};
    await this.sdk.subscribe(event, onEvent, args);
    if (this.closed) {
      await this.sdk.unsubscribe(event, onEvent, args);
      throw new Error('Spatial voice session is closed');
    }
    return this.trackUnsubscriber(async () => {
      await this.sdk.unsubscribe(event, onEvent, args);
    });
  }

  private trackUnsubscriber(cleanup: () => Promise<void>): () => Promise<void> {
    let active = true;
    const unsubscribe = async () => {
      if (!active) return;
      active = false;
      this.unsubscribers.delete(unsubscribe);
      await cleanup();
    };
    this.unsubscribers.add(unsubscribe);
    return unsubscribe;
  }
}

export class SpatialVoice {
  private activeSession: SpatialVoiceSession | null = null;
  private creatingSession: Promise<SpatialVoiceSession> | null = null;

  constructor(private readonly sdk: SpatialVoiceTransport) {}

  async getCapabilities(): Promise<SpatialVoiceCapabilities> {
    return mapCapabilities(await this.sdk.commands.getSpatialVoiceCapabilities(undefined));
  }

  async getParticipants(): Promise<SpatialVoiceParticipant[]> {
    const response = await this.sdk.commands.getSpatialVoiceParticipants(undefined);
    return response.participants.map(mapParticipant);
  }

  async createSession(): Promise<SpatialVoiceSession> {
    if (this.creatingSession != null) {
      return this.creatingSession;
    }

    const creatingSession = this.createSessionInternal();
    this.creatingSession = creatingSession;
    try {
      return await creatingSession;
    } finally {
      if (this.creatingSession === creatingSession) {
        this.creatingSession = null;
      }
    }
  }

  private async createSessionInternal(): Promise<SpatialVoiceSession> {
    if (this.activeSession != null) {
      await this.activeSession.close();
    }
    const response = await this.sdk.commands.startSpatialVoiceSession(undefined);
    const session = new SpatialVoiceSession(this.sdk, response, () => {
      if (this.activeSession === session) {
        this.activeSession = null;
      }
    });
    this.activeSession = session;
    return session;
  }
}
