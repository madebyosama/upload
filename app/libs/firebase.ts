// app/libs/firebase.ts

import { initializeApp, getApp, getApps } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Only initialize Firebase in the browser (client-side)
let app;
if (typeof window !== 'undefined') {
  // Check if Firebase has already been initialized
  if (!getApps().length) {
    app = initializeApp(firebaseConfig); // Initialize Firebase if not already initialized
  } else {
    app = getApp(); // Use the existing app instance if already initialized
  }
}

const storage = app ? getStorage(app) : null;

export { storage };
