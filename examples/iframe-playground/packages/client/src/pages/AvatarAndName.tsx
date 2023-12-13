import React from 'react';
import discordSdk from '../discordSdk';
import ReactJsonView from '../components/ReactJsonView';
import {DiscordAPI, RequestType} from '../DiscordAPI';
import {authStore} from '../stores/authStore';

interface GuildsMembersRead {
  roles: string[];
  nick: string | null;
  avatar: string | null;
  premium_since: string | null;
  joined_at: string;
  is_pending: boolean;
  pending: boolean;
  communication_disabled_until: string | null;
  user: {
    id: string;
    username: string;
    avatar: string | null;
    discriminator: string;
    public_flags: number;
  };
  mute: boolean;
  deaf: boolean;
}

export default function AvatarAndName() {
  const auth = authStore.getState();
  const [guildsMembersRead, setGuildsMembersRead] = React.useState<GuildsMembersRead | null>(null);

  React.useEffect(() => {
    if (auth == null) {
      return;
    }
    DiscordAPI.request<GuildsMembersRead>(
      {method: RequestType.GET, endpoint: `/users/@me/guilds/${discordSdk.guildId}/member`},
      auth.access_token
    ).then((reply) => {
      setGuildsMembersRead(reply);
    });
  }, [auth]);

  if (!auth) {
    return <></>;
  }

  // Note: instead of doing this here, your app's server could retrieve this
  // data by using the user's OAuth token

  // Get the user's profile avatar uri
  // If none available, use a default avatar
  const userAvatarSrc = auth.user.avatar
    ? `https://cdn.discordapp.com/avatars/${auth.user.id}/${auth.user.avatar}.png?size=256`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(auth.user.discriminator) % 5}.png`;
  const username = `${auth.user.username}#${auth.user.discriminator}`;

  // Get the user's guild-specific avatar uri
  // If none, fall back to the user profile avatar
  // If no main avatar, use a default avatar
  const guildAvatarSrc = guildsMembersRead?.avatar
    ? `https://cdn.discordapp.com/guilds/${discordSdk.guildId}/users/${auth.user.id}/avatars/${guildsMembersRead.avatar}.png?size=256`
    : auth.user.avatar
    ? `https://cdn.discordapp.com/avatars/${auth.user.id}/${auth.user.avatar}.png?size=256`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(auth.user.discriminator) % 5}.png`;

  // Get the user's guild nickname. If none set, use profile "name#discriminator"
  const guildNickname = guildsMembersRead?.nick ?? `${auth.user.username}${auth.user.discriminator}`;

  return (
    <div style={{padding: 32, overflowX: 'auto'}}>
      <div>
        <h1>User Avatar and Name</h1>
        <div>
          Check out more info on fetching discord-specific CDN assets{' '}
          <a
            href="https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints"
            onClick={(e) => {
              e.preventDefault();
              discordSdk.commands.openExternalLink({
                url: 'https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints',
              });
            }}>
            here
          </a>
          .
        </div>
        <br />
        <br />
        <div>
          <p>User avatar and nickname</p>
          <img alt="avatar" src={userAvatarSrc} />
          <p>User Avatar url: "{userAvatarSrc}"</p>
          <p>Username: "{username}"</p>
        </div>
        <br />
        <br />
        <div>
          <p>Guild-specific user avatar and nickname</p>
          {guildsMembersRead == null ? (
            <p>...loading</p>
          ) : (
            <>
              <img alt="avatar" src={guildAvatarSrc} />
              <p>Guild Member Avatar url: "{guildAvatarSrc}"</p>
              <p>Guild nickname: "{guildNickname}"</p>
            </>
          )}
        </div>
      </div>
      {guildsMembersRead == null ? null : (
        <>
          <br />
          <div>API response from {`/api/users/@me/guilds/${discordSdk.guildId}/member`}</div>
          <ReactJsonView src={guildsMembersRead} />
        </>
      )}
    </div>
  );
}
