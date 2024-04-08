import * as React from 'react';
import discordSdk from '../discordSdk';
import {EventPayloadData} from '@discord/embedded-app-sdk';
import {getUserDisplayName} from '../utils/getUserDisplayName';

export default function ActivityParticipants() {
  const [participants, setParticipants] = React.useState<
    EventPayloadData<'ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE'>['participants']
  >([]);
  const [speakingParticipants, setSpeakingParticipants] = React.useState<string[]>([]); // Array of user ids who are currently speaking

  React.useEffect(() => {
    const updateParticipants = (res: EventPayloadData<'ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE'>) => {
      setParticipants(res.participants);
    };
    discordSdk.commands.getInstanceConnectedParticipants().then(updateParticipants);
    discordSdk.subscribe('ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE', updateParticipants);

    return () => {
      discordSdk.unsubscribe('ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE', updateParticipants);
    };
  }, []);

  React.useEffect(() => {
    const addSpeakingParticipants = (res: EventPayloadData<'SPEAKING_START'>) => {
      setSpeakingParticipants((s) => [...s, res.user_id]);
    };
    const removeSpeakingParticipants = (res: EventPayloadData<'SPEAKING_STOP'>) => {
      setSpeakingParticipants((speakingParticipants) =>
        speakingParticipants.filter((speakingParticipant) => speakingParticipant !== res.user_id),
      );
    };
    discordSdk.subscribe('SPEAKING_START', addSpeakingParticipants, {channel_id: discordSdk.channelId});
    discordSdk.subscribe('SPEAKING_STOP', removeSpeakingParticipants, {channel_id: discordSdk.channelId});

    return () => {
      discordSdk.unsubscribe('SPEAKING_START', addSpeakingParticipants, {channel_id: discordSdk.channelId});
      discordSdk.unsubscribe('SPEAKING_STOP', removeSpeakingParticipants, {channel_id: discordSdk.channelId});
    };
  }, []);
  return (
    <div style={{padding: 32}}>
      <h2>Tracking instance participants and their speaking state</h2>
      <br />
      <p>This example tracks who is participating in the activity and whether or not they are speaking.</p>
      <br />
      <div style={{display: 'grid', gridTemplateColumns: '200px 1fr', gap: 8}}>
        <div>
          <b>Username</b>
        </div>
        <div>
          <b>Speaking Status</b>
        </div>
        {participants.map((user) => {
          return (
            <React.Fragment key={user.id}>
              <div>{getUserDisplayName({guildMember: null, user})}</div>
              <div>{speakingParticipants.some((s) => s === user.id) ? 'Speaking' : 'Not Speaking'}</div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
