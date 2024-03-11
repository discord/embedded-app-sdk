import * as React from 'react';
import {LoadingScreen} from './LoadingScreen';
import {authStore} from '../stores/authStore';
import {start} from '../actions/authActions';

export function AuthProvider({children}: {children: React.ReactNode}) {
  const auth = authStore();

  React.useEffect(() => {
    start();
  }, []);

  if (auth.user == null) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
