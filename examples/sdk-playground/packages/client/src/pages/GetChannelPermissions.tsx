import React from 'react';

import discordSdk from '../discordSdk';
import ReactJsonView from '../components/ReactJsonView';

export default function GetChannelPermissions() {
  const [channelPermissions, setChannelPermissions] = React.useState<Awaited<
    ReturnType<typeof discordSdk.commands.getChannelPermissions>
  > | null>(null);

  React.useEffect(() => {
    async function getChannelPermissions() {
      const channelPermissions = await discordSdk.commands.getChannelPermissions();
      setChannelPermissions(channelPermissions);
    }
    getChannelPermissions();
  }, []);

  return (
    <div style={{padding: 32}}>
      <div>
        <h1>Get Channel Permisssions</h1>
        <br />
        <br />
        {channelPermissions == null ? null : <ReactJsonView src={channelPermissions} />}
      </div>
    </div>
  );
}
