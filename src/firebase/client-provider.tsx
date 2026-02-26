'use client';

import * as React from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import { FirebaseProvider } from './provider';
import { initializeFirebase } from './config';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const app = initializeFirebase();
  const auth = getAuth(app);
  const db = getFirestore(app);

  return <FirebaseProvider value={{ app, auth, db }}>{children}</FirebaseProvider>;
}
