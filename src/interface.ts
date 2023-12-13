import {Platform, RPCCloseCodes} from './Constants';
import commands from './commands';
import type {Mapping} from './utils/networkShims';

/**
 * An optional configuration object to customize the sdk options
 */
export interface SdkConfiguration {
  /**
   * By default, all console logging is overridden and forwarded to the host application.
   * Logs will still be sent to the web console as well.
   * Setting this flag to true will disable this functionality
   */
  readonly disableConsoleLogOverride: boolean;
}

export interface IDiscordSDK {
  readonly clientId: string;
  readonly instanceId: string;
  readonly platform: Platform;
  readonly commands: ReturnType<typeof commands>;
  readonly configuration: SdkConfiguration;
  readonly channelId: string | null;
  readonly guildId: string | null;

  close(code: RPCCloseCodes, message: string): void;
  subscribe(
    event: string,
    listener: (...args: any[]) => unknown,
    subscribeArgs?: Record<string, unknown>
  ): Promise<any>;
  unsubscribe(event: string, listener: (...args: any[]) => unknown): Promise<any>;
  initializeNetworkShims(mappings: Mapping[]): void;
  ready(): Promise<void>;

  /**
   * Subscribe to the ACTIVITY_LAYOUT_MODE_UPDATE event, and handle backward compatibility
   * with old Discord clients that only support ACTIVITY_PIP_MODE_UPDATE.
   */
  subscribeToLayoutModeUpdatesCompat(listener: (...args: any[]) => unknown): Promise<any>;

  /**
   * Unsubscribe from the ACTIVITY_LAYOUT_MODE_UPDATE event, and handle backward compatibility
   * with old Discord clients that only support ACTIVITY_PIP_MODE_UPDATE.
   */
  unsubscribeFromLayoutModeUpdatesCompat(listener: (...args: any[]) => unknown): Promise<any>;
}

export type EventListener = (...args: any[]) => unknown;

export interface LayoutModeEventListeners {
  layoutModeListener: EventListener;
  pipModeListener: EventListener;
}
