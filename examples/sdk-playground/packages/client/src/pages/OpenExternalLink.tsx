import discordSdk from '../discordSdk';

// Note: we're still using the anchor tag, to ensure standard accessibility UX
export default function OpenExternalLink() {
  return (
    <div style={{padding: 32}}>
      <h1>Open external link</h1>
      <p>
        Click here to go to google:{' '}
        <a
          href="https://google.com"
          onClick={(e) => {
            e.preventDefault();
            discordSdk.commands.openExternalLink({url: 'https://google.com'});
          }}>
          Google!
        </a>
      </p>
    </div>
  );
}
