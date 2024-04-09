import React from 'react';

import discordSdk from '../discordSdk';
import ReactJsonView from '../components/ReactJsonView';

export default function GetInstanceConnectedParticipants() {
  const [participants, setParticipants] = React.useState<Awaited<
    ReturnType<typeof discordSdk.commands.getInstanceConnectedParticipants>
  > | null>(null);

  React.useEffect(() => {
    async function getParticipants() {
      const participants = await discordSdk.commands.getInstanceConnectedParticipants();
      setParticipants(participants);
    }
    getParticipants();
  }, []);

  return (
    <div style={{padding: 32}}>
      <div>
        <h1>Get Instance Connected Participants</h1>
        <br />
        <br />
        {participants == null ? null : <ReactJsonView src={participants} />}
      </div>
    </div>
  );
}
