import {DiscordSDK, DiscordSDKMock, IDiscordSDK, patchUrlMappings} from '@discord/embedded-app-sdk';

const queryParams = new URLSearchParams(window.location.search);
const isEmbedded = queryParams.get('frame_id') != null;

let discordSdk: IDiscordSDK;

if (isEmbedded) {
  discordSdk = new DiscordSDK(import.meta.env.VITE_CLIENT_ID, {disableConsoleLogOverride: true});
  patchUrlMappings([]);
} else {
  discordSdk = new DiscordSDKMock(import.meta.env.VITE_CLIENT_ID, null, null);
  // @ts-expect-error
  discordSdk.channelId = 'test_channel_id';
  let storedUserId = sessionStorage.getItem('user_id');
  if (storedUserId == null) {
    // Set user_id to a random 8-character string, this gives us a consistent user id
    storedUserId = Math.random().toString(36).slice(2, 10);
    sessionStorage.setItem('user_id', storedUserId);
  }
  const queryParamsUserId = new URLSearchParams(window.location.search).get('user_id');

  const userId = queryParamsUserId ?? storedUserId ?? '';
  const discriminator = String(userId.charCodeAt(0) % 5);

  (discordSdk as DiscordSDKMock)._updateCommandMocks({
    authenticate: () =>
      Promise.resolve({
        access_token: 'mock_token',
        user: {
          username: userId,
          discriminator,
          id: userId,
          avatar: null,
          public_flags: 1,
        },
        scopes: [],
        expires: new Date(2112, 1, 1).toString(),
        application: {
          description: 'mock_app_description',
          icon: 'mock_app_icon',
          id: 'mock_app_id',
          name: 'mock_app_name',
        },
      }),
  });
}

export default discordSdk;
