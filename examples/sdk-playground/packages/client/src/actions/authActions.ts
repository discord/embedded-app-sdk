import {authStore} from '../stores/authStore';
import discordSdk from '../discordSdk';
import {type Types} from '@discord/embedded-app-sdk';
import {IGuildsMembersRead} from '../types';

export const start = async () => {
  const {user} = authStore.getState();

  if (user != null) {
    return;
  }

  await discordSdk.ready();

  // Authorize with Discord Client
  const {code} = await discordSdk.commands.authorize({
    client_id: import.meta.env.VITE_CLIENT_ID,
    response_type: 'code',
    state: '',
    prompt: 'none',
    // More info on scopes here: https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes
    scope: [
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
      discordSdk.guildId == null ? 'dm_channels.read' : null, // This scope requires approval from Discord.
    ].filter((scope) => scope != null) as Types.OAuthScopes[],
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
  const guildMember = await fetch(`/discord/api/users/@me/guilds/${discordSdk.guildId}/member`, {
    method: 'get',
    headers: {Authorization: `Bearer ${access_token}`},
  })
    .then((j) => j.json<IGuildsMembersRead>())
    .catch(() => {
      return null;
    });

  // Done with discord-specific setup

  const authState = {
    ...authResponse,
    user: {
      ...authResponse.user,
      id: new URLSearchParams(window.location.search).get('user_id') ?? authResponse.user.id,
    },
    guildMember,
  };

  authStore.setState({
    ...authState,
  });
};
