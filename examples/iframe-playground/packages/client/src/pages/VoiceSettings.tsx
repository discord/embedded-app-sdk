import React from 'react';
import discordSdk from '../discordSdk';
import ReactJsonView from '../components/ReactJsonView';

export default function VoiceSettings() {
  const [voiceSettings, setVoiceSettings] = React.useState<any | null>(null);
  const [commandError, setCommandError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const updateVoiceSettings = (voiceSettings: any) => {
      setVoiceSettings(voiceSettings);
    };
    discordSdk.subscribe('VOICE_SETTINGS_UPDATE', updateVoiceSettings);
    return () => {
      discordSdk.unsubscribe('VOICE_SETTINGS_UPDATE', updateVoiceSettings);
    };
  }, []);

  const getVoiceSettings = async () => {
    try {
      const voiceSettings = await discordSdk.commands.getVoiceSettings();
      setVoiceSettings(voiceSettings);
    } catch (e: any) {
      setCommandError(e.message ?? 'Unknown Error');
    }
  };

  return (
    <div style={{padding: 32}}>
      <div>
        <h1>Command</h1>
        <h2>GET_VOICE_SETTINGS</h2>
        <br />
        <button onClick={getVoiceSettings}>Get Voice Settings!</button>
        <br />
        <button onClick={() => setVoiceSettings(null)}>Clear Voice Settings!</button>
        {commandError ? <h3 style={{color: 'red'}}> Error: ${commandError} </h3> : null}
        <br />
        <h1>Event Subscription</h1>
        <h2>VOICE_SETTINGS_UPDATE</h2>
        <br />
        <br />
        {voiceSettings ? <ReactJsonView src={voiceSettings} /> : null}
      </div>
    </div>
  );
}
