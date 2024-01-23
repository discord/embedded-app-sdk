import {authStore} from '../stores/authStore';
import discordSdk from '../discordSdk';
import {fetchGuildsUserAvatarAndNickname} from '../utils/fetchGuildsUserAvatarAndNickname';
import {type Types} from '@discord/embedded-app-sdk';

export const start = async () => {
  const {user} = authStore.getState();

  if (user != null) {
    return;
  }

  await discordSdk.ready();

  const scope: Types.OAuthScopes[] = [
    // "applications.builds.upload",
    // "applications.builds.read",
    // "applications.store.update",
    // "applications.entitlements",
    // "bot",
    'identify',
    // "connections",
    // "email",
    // "gdm.join",
    'guilds',
    // "guilds.join",
    'guilds.members.read',
    // "messages.read",
    // "relationships.read",
    // 'rpc.activities.write',
    // "rpc.notifications.read",
    'rpc.voice.write',
    'rpc.voice.read',
    // "webhook.incoming",
  ];

  if (discordSdk.guildId == null) {
    scope.push('dm_channels.read');
  }

  // Authorize with Discord Client
  const {code} = await discordSdk.commands.authorize({
    client_id: import.meta.env.VITE_CLIENT_ID,
    response_type: 'code',
    state: '',
    prompt: 'none',
    // More info on scopes here: https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes
    scope,
  });

  // Retrieve an access_token from your embedded app's server
  const response = await fetch('/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
    }),
  });

  const {access_token} = await response.json<{access_token: string}>();
  // Authenticate with Discord client (using the access_token)
  const authResponse = await discordSdk.commands.authenticate({
    access_token,
  });

  // Get guild specific nickname and avatar, and fallback to user name and avatar
  const guildsReadInfo = await fetchGuildsUserAvatarAndNickname(authResponse);

  // Done with discord-specific setup

  const authState = {
    ...authResponse,
    user: {
      ...authResponse.user,
      id: new URLSearchParams(window.location.search).get('user_id') ?? authResponse.user.id,
    },
    ...guildsReadInfo,
  };

  authStore.setState({
    ...authState,
  });
};
