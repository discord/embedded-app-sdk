import React from 'react';
import discordSdk from '../discordSdk';
import ReactJsonView from '../components/ReactJsonView';
import {useLocation} from 'react-router-dom';
import {EventPayloadData} from '@discord/embedded-app-sdk';

export default function VoiceState() {
  const [voiceState, setVoiceState] = React.useState<any | null>(null);
  const location = useLocation();

  React.useEffect(() => {
    const {channelId} = discordSdk;
    if (!channelId) return;

    const updateVoiceState = (voiceState: EventPayloadData<'VOICE_STATE_UPDATE'>) => {
      setVoiceState(voiceState);
    };
    discordSdk.subscribe('VOICE_STATE_UPDATE', updateVoiceState, {
      channel_id: channelId,
    });
    return () => {
      discordSdk.unsubscribe('VOICE_STATE_UPDATE', updateVoiceState);
    };
  }, [location.search]);

  return (
    <div style={{padding: 32}}>
      <div>
        <h1>Event Subscription</h1>
        <h2>VOICE_STATE_UPDATE</h2>
        <br />
        <br />
        {voiceState ? <ReactJsonView src={voiceState} /> : null}
      </div>
    </div>
  );
}
