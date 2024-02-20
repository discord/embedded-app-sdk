import {useState, useEffect} from 'react';
import discordSdk from '../discordSdk';
import {Events, EventPayloadData} from '@discord/embedded-app-sdk';

type UpdateEvent = EventPayloadData<'ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE'>;

export default function Instance() {
  const [participants, setParticipants] = useState<UpdateEvent['participants']>([]);
  useEffect(() => {
    const updateParticipants = (res: UpdateEvent) => {
      setParticipants(res.participants);
    };
    discordSdk.commands.getInstanceConnectedParticipants().then(updateParticipants);
    discordSdk.subscribe(Events.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE, updateParticipants);

    return () => {
      discordSdk.unsubscribe(Events.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE, updateParticipants);
    };
  }, []);
  return (
    <div>
      <b>Participants:</b>
      <ul>
        {participants.map((user) => {
          return <li key={user.id}>{user.nickname ?? user.global_name}</li>;
        })}
      </ul>
    </div>
  );
}
