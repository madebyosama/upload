// lib/firebase.ts
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only once on the client-side
if (typeof window !== 'undefined' && getApps().length === 0) {
  // Initialize Firebase only if there are no initialized apps
  initializeApp(firebaseConfig);
} else {
  // If already initialized, just get the app instance
  getApp();
}

const storage = getStorage();

export { storage };
