/**
 * @jest-environment jsdom
 */
import {Opcodes} from '../Discord';
import {DiscordSDK, Events, Platform} from '../index';
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
});
