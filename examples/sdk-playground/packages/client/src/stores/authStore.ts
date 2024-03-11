import create from 'zustand';

import type {TAuthenticatedContext} from '../types';

export const authStore = create<TAuthenticatedContext>(() => ({
  user: undefined as unknown as TAuthenticatedContext['user'],
  access_token: '',
  scopes: [],
  expires: '',
  application: {
    rpc_origins: undefined,
    id: '',
    name: '',
    icon: null,
    description: '',
  },
  guildMember: null,
}));
