import React from 'react';
import discordSdk from '../discordSdk';
import ReactJsonView from '../components/ReactJsonView';
import {useLocation} from 'react-router-dom';
import {EventPayloadData} from '@discord/embedded-app-sdk';

export default function CurrentGuildMember() {
  const [currentGuildMember, setCurrentGuildMember] =
    React.useState<EventPayloadData<'CURRENT_GUILD_MEMBER_UPDATE'> | null>(null);
  const location = useLocation();

  React.useEffect(() => {
    const {channelId} = discordSdk;
    if (!channelId) return;

    const handleCurrentGuildMemberUpdate = (
      currentGuildMemberEvent: EventPayloadData<'CURRENT_GUILD_MEMBER_UPDATE'>,
    ) => {
      setCurrentGuildMember(currentGuildMemberEvent);
    };

    const guildId = discordSdk.guildId;
    if (guildId) {
      discordSdk.subscribe('CURRENT_GUILD_MEMBER_UPDATE', handleCurrentGuildMemberUpdate, {
        guild_id: guildId,
      });
    }

    return () => {
      if (guildId) {
        discordSdk.unsubscribe('CURRENT_GUILD_MEMBER_UPDATE', handleCurrentGuildMemberUpdate, {
          guild_id: guildId,
        });
      }
    };
  }, [location.search]);

  return (
    <div style={{padding: 32}}>
      <div>
        <h1>Event Subscription</h1>
        <h2>CURRENT_GUILD_MEMBER_UPDATE</h2>
        <br />
        <br />
        {currentGuildMember ? <ReactJsonView src={currentGuildMember} /> : null}
      </div>
    </div>
  );
}
