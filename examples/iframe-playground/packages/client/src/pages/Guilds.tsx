import React from 'react';
import {useInterval} from 'react-use';

import {DiscordAPI, RequestType} from '../DiscordAPI';
import {authStore} from '../stores/authStore';

interface Guild {
  features: string[];
  icon: string;
  id: string;
  name: string;
  owner: boolean;
  permissions: number;
  permissions_new: string;
}

export default function Guilds() {
  const auth = authStore();
  const [guilds, setGuilds] = React.useState<Guild[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchGuilds = React.useCallback(() => {
    if (!auth) {
      return;
    }
    DiscordAPI.request<Guild[]>(
      {
        method: RequestType.GET,
        endpoint: '/users/@me/guilds',
      },
      auth.access_token
    )
      .then((val) => {
        setGuilds(val);
        if (loading) {
          setLoading(false);
        }
      })
      .catch((_e) => {
        // console.log('request error', e);
      });
  }, [auth, loading]);

  useInterval(fetchGuilds, 2000);

  return (
    <div style={{padding: 32}}>
      <h1>Your Guilds</h1>
      <br />
      <br />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(128px, 1fr))',
            gridGap: '16px',
          }}>
          {}
          {guilds.map((g) => (
            <div key={g.id}>
              <img alt="Server Icon" src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.webp?size=128`} />
              <div>{g.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
