import React from 'react';
import discordSdk from '../discordSdk';
import ReactJsonView from '../components/ReactJsonView';
import {DiscordAPI, RequestType} from '../DiscordAPI';
import {authStore} from '../stores/authStore';

/** Full guild "shape" here: https://discord.com/developers/docs/resources/guild#guild-object-guild-structure */
interface Guild {
  id: string;
}

export default function CurrentGuild() {
  const [guild, setGuild] = React.useState<Guild | null>(null);
  const auth = authStore();

  React.useEffect(() => {
    async function update() {
      if (!auth) {
        return;
      }
      const guildId = discordSdk.guildId;
      if (!guildId) {
        return;
      }
      const guilds = await DiscordAPI.request<Guild[]>(
        {method: RequestType.GET, endpoint: `/users/@me/guilds`},
        auth.access_token
      );
      const newGuild = guilds.find(({id}) => id === guildId) ?? null;
      setGuild(newGuild);
    }
    update();
  }, [auth]);

  return (
    <div style={{padding: 32}}>
      <div>
        <h1>Current Guild</h1>
        <br />
        <br />
        {guild ? <ReactJsonView src={guild} /> : null}
      </div>
    </div>
  );
}
