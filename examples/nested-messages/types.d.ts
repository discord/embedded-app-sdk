declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLIENT_ID: string;
    }
  }
}

export {};
