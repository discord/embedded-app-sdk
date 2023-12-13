import {useState, useEffect} from 'react';
import discordSdk from '../discordSdk';
import {Events, Types} from '@discord/embedded-app-sdk';

type Response = Types.GetActivityInstanceConnectedParticipantsResponse;

export default function Instance() {
  const [participants, setParticipants] = useState<Response['participants']>([]);
  useEffect(() => {
    const updateParticipants = (res: Response) => {
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
