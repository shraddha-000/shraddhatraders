'use client';

import * as React from 'react';
import { Auth } from 'firebase/auth';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';

export type FirebaseContextValue = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
};

const FirebaseContext = React.createContext<FirebaseContextValue | null>(null);

export function FirebaseProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: FirebaseContextValue;
}) {
  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
}

export function useFirebase() {
  const context = React.useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

export function useFirebaseApp() {
  return useFirebase().app;
}

export function useAuth() {
  return useFirebase().auth;
}

export function useFirestore() {
  return useFirebase().db;
}
