const isProxied = import.meta.env.VITE_IS_PROXIED === 'true';
const discordApiBase = import.meta.env.VITE_DISCORD_API_BASE;

export const Constants = {
  WS_PORT: 3001,
  urls: {
    discord: discordApiBase,
    youtube: isProxied ? '/youtube' : 'https://youtube.com',
  },
} as const;
