import React from 'react';
import discordSdk from '../discordSdk';
import ReactJsonView from '../components/ReactJsonView';
import {useLocation} from 'react-router-dom';
import {EventPayloadData} from '@discord/embedded-app-sdk';

export default function CurrentUser() {
  const [currentUser, setCurrentUser] = React.useState<EventPayloadData<'CURRENT_USER_UPDATE'> | null>(null);
  const location = useLocation();

  React.useEffect(() => {
    const {channelId} = discordSdk;
    if (!channelId) return;

    const handleCurrentUserUpdate = (currentUserEvent: EventPayloadData<'CURRENT_USER_UPDATE'>) => {
      setCurrentUser(currentUserEvent);
    };
    discordSdk.subscribe('CURRENT_USER_UPDATE', handleCurrentUserUpdate);
    return () => {
      discordSdk.unsubscribe('CURRENT_USER_UPDATE', handleCurrentUserUpdate);
    };
  }, [location.search]);

  return (
    <div style={{padding: 32}}>
      <div>
        <h1>Event Subscription</h1>
        <h2>CURRENT_USER_UPDATE</h2>
        <br />
        <br />
        {currentUser ? <ReactJsonView src={currentUser} /> : null}
      </div>
    </div>
  );
}
