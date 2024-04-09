import React from 'react';

import discordSdk from '../discordSdk';
import ReactJsonView from '../components/ReactJsonView';

export default function UserSettingsGetLocale() {
  const [locale, setLocale] = React.useState<Awaited<
    ReturnType<typeof discordSdk.commands.userSettingsGetLocale>
  > | null>(null);

  React.useEffect(() => {
    async function getEntitlements() {
      const locale = await discordSdk.commands.userSettingsGetLocale();
      setLocale(locale);
    }
    getEntitlements();
  }, []);

  return (
    <div style={{padding: 32}}>
      <div>
        <h1>User Settings Get Locale</h1>
        <br />
        <br />
        {locale == null ? null : <ReactJsonView src={locale} />}
      </div>
    </div>
  );
}
