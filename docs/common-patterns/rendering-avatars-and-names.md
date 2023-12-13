# Rendering avatars and names

Check out detailed documentation on where and how Discord stores common image assets [here](https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints).

Here's a basic example for retrieving a user's avatar and username

```ts
// We'll be referencing the user object returned from authenticate
const {user} = await DiscordRPC.commands.authenticate({
  access_token: accessToken,
});

let avatarSrc = '';
if (user.avatar) {
  avatarSrc = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`;
} else {
  const discriminator = parseInt(user.discriminator);
  const defaultAvatarIndex = Number.isNaN(discriminator) ? 0 : discriminator % 5;
  avatarSrc = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`
}

const username = `${user.username}#${user.discriminator}`;

// Then in your HTML/JSX/etc...
<img alt="avatar" src={avatarSrc} />
<p>{username}</p>
```

### Rendering guild-specific avatars and nicknames

In order to retrieve a user's guild-specific avatar and nickname, your application must request the `guilds.members.read` scope. Note, this only grants the information for that instance of the application's user. To display the guild-specific avater/nickname for all application users, any info retrieved from `guilds.members.read` scope'd API calls must be shared via your application's server.

Here's an example of how to retrieve the user's guild-specific avatar and nickname:

```ts
// We'll be referencing the user object returned from authenticate
const {user} = await DiscordRPC.commands.authenticate({
  access_token: accessToken,
});

// When using the proxy, you may instead replace `https://discord.com` with `/discord`
// or whatever url mapping you have chosen via the developer portal
fetch(`https://discord.com/api/users/@me/guilds/${DiscordRPC.guildId}/member`, {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
})
  .then((response) => {
    return response.json();
  })
  .then((guildsMembersRead) => {
    let guildAvatarSrc = '';
    // Retrieve the guild-specific avatar, and fallback to the user's avatar
    if (guildsMembersRead?.avatar) {
      guildAvatarSrc = `https://cdn.discordapp.com/guilds/${DiscordRPC.guildId}/users/${user.id}/avatars/${guildsMembersRead.avatar}.png?size=256`;
    } else if (user.avatar) {
      guildAvatarSrc = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`;
    } else {
      const discriminator = parseInt(user.discriminator);
      const defaultAvatarIndex = Number.isNaN(discriminator) ? 0 : discriminator % 5;
      avatarSrc = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
    }

    // Retrieve the guild-specific nickname, and fallback to the username#discriminator
    const guildNickname = guildsMembersRead?.nick ?? `${user.username}#${user.discriminator}`;
  });
```

This example is being done entirely on the client, however, a more common pattern is to instead, do the following:

- Store the user's access token on the application server
- Retrieve the user's guild-specific avatar and nickname via the application's server
- Serve all of the application's avatar/nicknames via the application's server
