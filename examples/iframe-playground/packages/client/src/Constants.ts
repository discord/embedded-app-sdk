const discordApiBase = import.meta.env.VITE_DISCORD_API_BASE;

export const Constants = {
  WS_PORT: 3001,
  urls: {
    discord: discordApiBase,
    youtube: '/youtube',
  },
} as const;
