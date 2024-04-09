import React from 'react';

import discordSdk from '../discordSdk';
import ReactJsonView from '../components/ReactJsonView';

export default function GetChannel() {
  const [channel, setChannel] = React.useState<Awaited<ReturnType<typeof discordSdk.commands.getChannel>> | null>(null);

  React.useEffect(() => {
    async function getChannel() {
      if (discordSdk.channelId == null) return;
      const channel = await discordSdk.commands.getChannel({channel_id: discordSdk.channelId});
      setChannel(channel);
    }
    getChannel();
  }, []);

  return (
    <div style={{padding: 32}}>
      <div>
        <h1>Get Channel</h1>
        <br />
        <br />
        {channel == null ? null : <ReactJsonView src={channel} />}
      </div>
    </div>
  );
}
