import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance safely
export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore Database
export const db = getFirestore(
  firebaseApp,
  firebaseConfig.firestoreDatabaseId || undefined
);

// Initialize Firebase Auth
export const auth = getAuth(firebaseApp);
