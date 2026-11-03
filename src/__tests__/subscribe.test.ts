/**
 * @jest-environment jsdom
 */
import {Opcodes} from '../Discord';
import {DiscordSDK, Events, Platform, RPCErrorCodes} from '../index';
import {Commands} from '../schema/common';

const postMessage = jest.fn();

function sentSubscribeNonces(): string[] {
  return postMessage.mock.calls
    .filter(([[opcode, payload]]) => opcode === Opcodes.FRAME && payload.cmd === Commands.SUBSCRIBE)
    .map(([[, payload]]) => payload.nonce);
}

function reply(payload: Record<string, unknown>) {
  dispatchEvent(new MessageEvent('message', {data: [Opcodes.FRAME, payload], origin: 'https://discord.com'}));
}

describe('DiscordSDK.subscribe', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      value: {
        get search() {
          return `?${new URLSearchParams({frame_id: '1234', instance_id: '2345', platform: Platform.DESKTOP}).toString()}`;
        },
      },
    });
    Object.defineProperty(window, 'parent', {value: {postMessage}});
  });

  beforeEach(() => {
    postMessage.mockClear();
  });

  it('sends SUBSCRIBE again when retried after a failed subscribe', async () => {
    const discordSdk = new DiscordSDK('1234567890');
    const listener = jest.fn();

    const failed = discordSdk.subscribe(Events.CURRENT_USER_UPDATE, listener);
    expect(sentSubscribeNonces()).toHaveLength(1);
    const error = {code: RPCErrorCodes.INVALID_PERMISSIONS, message: 'Missing scope'};
    reply({cmd: Commands.SUBSCRIBE, evt: 'ERROR', nonce: sentSubscribeNonces()[0], data: error});
    await expect(failed).rejects.toEqual(error);

    const retried = discordSdk.subscribe(Events.CURRENT_USER_UPDATE, listener);
    expect(sentSubscribeNonces()).toHaveLength(2);
    reply({
      cmd: Commands.SUBSCRIBE,
      evt: null,
      nonce: sentSubscribeNonces()[1],
      data: {evt: Events.CURRENT_USER_UPDATE},
    });
    await retried;
  });

  it('sends SUBSCRIBE only once for several listeners of the same event', async () => {
    const discordSdk = new DiscordSDK('1234567890');

    const first = discordSdk.subscribe(Events.CURRENT_USER_UPDATE, jest.fn());
    reply({
      cmd: Commands.SUBSCRIBE,
      evt: null,
      nonce: sentSubscribeNonces()[0],
      data: {evt: Events.CURRENT_USER_UPDATE},
    });
    await first;
    await discordSdk.subscribe(Events.CURRENT_USER_UPDATE, jest.fn());

    expect(sentSubscribeNonces()).toHaveLength(1);
  });
});
