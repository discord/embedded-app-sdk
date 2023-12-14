import * as React from 'react';
import {Client, Room} from 'colyseus.js';

import {State} from '../../../server/src/entities/State';
import {GAME_NAME} from '../../../server/src/shared/Constants';

import {discordSdk} from '../discordSdk';
import {LoadingScreen} from '../components/LoadingScreen';
import {fetchGuildsUserAvatarAndNickname} from '../utils/fetchGuildsUserAvatarAndNickname';

import type {TAuthenticateResponse, TAuthenticatedContext} from '../types';

const AuthenticatedContext = React.createContext<TAuthenticatedContext>({
  user: {
    id: '',
    username: '',
    discriminator: '',
    avatar: null,
    public_flags: 0,
  },
  access_token: '',
  scopes: [],
  expires: '',
  application: {
    rpc_origins: undefined,
    id: '',
    name: '',
    icon: null,
    description: '',
  },
  nick: '',
  avatarUri: '',
  client: undefined as unknown as Client,
  room: undefined as unknown as Room,
});

export function AuthenticatedContextProvider({children}: {children: React.ReactNode}) {
  const authenticatedContext = useAuthenticatedContextSetup();

  if (authenticatedContext == null) {
    return <LoadingScreen />;
  }

  return <AuthenticatedContext.Provider value={authenticatedContext}>{children}</AuthenticatedContext.Provider>;
}

export function useAuthenticatedContext() {
  return React.useContext(AuthenticatedContext);
}

/**
 * This is a helper hook which is used to connect your embedded app with Discord and Colyseus
 */
function useAuthenticatedContextSetup() {
  const [auth, setAuth] = React.useState<TAuthenticatedContext | null>(null);
  const settingUp = React.useRef(false);

  React.useEffect(() => {
    const setUpDiscordSdk = async () => {
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
          // "rpc.voice.write",
          'rpc.voice.read',
          // "webhook.incoming",
        ],
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
      const {access_token} = await response.json();

      // Authenticate with Discord client (using the access_token)
      const newAuth: TAuthenticateResponse = await discordSdk.commands.authenticate({
        access_token,
      });

      // Get guild specific nickname and avatar, and fallback to user name and avatar
      const guildsReadInfo = await fetchGuildsUserAvatarAndNickname(newAuth);

      // Done with discord-specific setup

      // Now we create a colyseus client
      const wsUrl = `wss://${location.host}/api/colyseus`;
      const client = new Client(wsUrl);

      let roomName = 'Channel';

      // Requesting the channel in GDMs (when the guild ID is null) requires
      // the dm_channels.read scope which requires Discord approval.
      if (discordSdk.channelId != null && discordSdk.guildId != null) {
        // Over RPC collect info about the channel
        const channel = await discordSdk.commands.getChannel({channel_id: discordSdk.channelId});
        if (channel.name != null) {
          roomName = channel.name;
        }
      }

      // The second argument has to include for the room as well as the current player
      const newRoom = await client.joinOrCreate<State>(GAME_NAME, {
        channelId: discordSdk.channelId,
        roomName,
        userId: newAuth.user.id,
        name: guildsReadInfo.nick,
        avatarUri: guildsReadInfo.avatarUri,
      });

      // Finally, we construct our authenticatedContext object to be consumed throughout the app
      setAuth({...newAuth, ...guildsReadInfo, client, room: newRoom});
    };

    if (!settingUp.current) {
      settingUp.current = true;
      setUpDiscordSdk();
    }
  }, []);

  return auth;
}
