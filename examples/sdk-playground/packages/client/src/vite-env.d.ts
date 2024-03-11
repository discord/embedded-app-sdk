/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLIENT_ID: string;
  readonly VITE_DISCORD_API_BASE: string;
  readonly VITE_APPLICATION_ID: string;
  // add env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
