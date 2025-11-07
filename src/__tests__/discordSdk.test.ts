/**
 * @jest-environment jsdom
 */
import {Opcodes} from '../Discord';
import {DiscordSDK, Events, Platform, RPCCloseCodes} from '../index';
import {DISPATCH} from '../schema/common';
import {version as sdkVersion} from '../../package.json';

describe('DiscordSDK', () => {
  it('Can be constructed and await a "ready" event', async () => {
    const frame_id = '1234';
    const instance_id = '2345';
    const platform = Platform.DESKTOP;
    const channel_id = '3456';
    const guild_id = '4567';
    const clientId = '1234567890';

    Object.defineProperty(window, 'location', {
      value: {
        get pathname() {
          return jest.fn();
        },
        replace: jest.fn(),
        get search() {
          return `?${new URLSearchParams({
            frame_id,
            instance_id,
            platform,
            channel_id,
            guild_id,
          }).toString()}`;
        },
      },
    });
    Object.defineProperty(window, 'parent', {
      value: {
        postMessage: jest.fn(),
      },
    });

    const discordSdk = new DiscordSDK(clientId);

    // Verify handshake
    expect(window.parent.postMessage).toHaveBeenCalledWith(
      [
        Opcodes.HANDSHAKE,
        {
          client_id: clientId,
          encoding: 'json',
          frame_id: frame_id,
          v: 1,
          sdk_version: sdkVersion,
        },
      ],
      '*',
    );

    // Verify instance variables
    expect(discordSdk.clientId).toBe(clientId);
    expect(discordSdk.instanceId).toBe(instance_id);
    expect(discordSdk.platform).toBe(platform);
    expect(discordSdk.channelId).toBe(channel_id);
    expect(discordSdk.guildId).toBe(guild_id);

    // Trigger "READY" event
    dispatchEvent(
      new MessageEvent('message', {
        data: [
          Opcodes.FRAME,
          {
            cmd: DISPATCH,
            data: {
              v: 1,
              config: {
                cdn_host: 'cdn.discordapp.com',
                api_endpoint: '//canary.discord.com/api',
                environment: 'production',
              },
            },
            evt: Events.READY,
            nonce: null,
          },
        ],
        origin: 'https://discord.com',
      }),
    );

    // Verify "READY" event resolves
    await discordSdk.ready();
  });

  describe('Proxy Token Refresh', () => {
    let discordSdk: DiscordSDK;
    let mockPostMessage: jest.Mock;

    beforeEach(() => {
      const frame_id = '1234';
      const instance_id = '2345';
      const platform = Platform.DESKTOP;
      const clientId = '1234567890';

      Object.defineProperty(window, 'location', {
        value: {
          get pathname() {
            return jest.fn();
          },
          replace: jest.fn(),
          get search() {
            return `?${new URLSearchParams({
              frame_id,
              instance_id,
              platform,
            }).toString()}`;
          },
          get origin() {
            return 'https://example.com';
          },
        },
      });

      mockPostMessage = jest.fn();
      Object.defineProperty(window, 'parent', {
        value: {
          postMessage: mockPostMessage,
        },
      });

      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: '',
      });

      global.fetch = jest.fn();
      jest.clearAllMocks();

      discordSdk = new DiscordSDK(clientId);
    });

    afterEach(() => {
      discordSdk.close(RPCCloseCodes.CLOSE_NORMAL, 'Test cleanup');
    });

    it('should have autoRefreshProxyToken disabled by default', () => {
      expect(discordSdk.configuration.autoRefreshProxyToken).toBe(false);
    });

    it('should enable autoRefreshProxyToken through constructor config', () => {
      const clientId = '1234567890';
      const sdkWithAutoRefresh = new DiscordSDK(clientId, {
        disableConsoleLogOverride: false,
        autoRefreshProxyToken: true,
      });

      expect(sdkWithAutoRefresh.configuration.autoRefreshProxyToken).toBe(true);

      sdkWithAutoRefresh.close(RPCCloseCodes.CLOSE_NORMAL, 'Test cleanup');
    });

    it('should have refreshProxyToken method available', () => {
      expect(typeof discordSdk.refreshProxyToken).toBe('function');
    });

    it('should rate limit successful refresh calls', async () => {
      // Mock the command and fetch to succeed for testing rate limiting
      const originalCommand = discordSdk.commands.requestProxyTicketRefresh;
      discordSdk.commands.requestProxyTicketRefresh = jest.fn().mockResolvedValue({ticket: 'test'});

      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValue({ok: true} as Response);

      // First call should succeed and update lastRefreshTime
      const result1 = await discordSdk.refreshProxyToken();
      expect(result1).toBe(true);
      expect(discordSdk.commands.requestProxyTicketRefresh).toHaveBeenCalledTimes(1);

      // Clear the mock call count but keep the same implementation
      (discordSdk.commands.requestProxyTicketRefresh as jest.Mock).mockClear();

      // Immediate second call should be rate limited (no new RPC call)
      const result2 = await discordSdk.refreshProxyToken();
      expect(result2).toBe(false);
      expect(discordSdk.commands.requestProxyTicketRefresh).toHaveBeenCalledTimes(0); // Rate limited

      // Restore original command
      discordSdk.commands.requestProxyTicketRefresh = originalCommand;
    });
  });
});
