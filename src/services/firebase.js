import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Determine if we have a valid Firebase configuration
const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey.length > 10 &&
  !firebaseConfig.apiKey.includes('YOUR_') &&
  firebaseConfig.projectId &&
  !firebaseConfig.projectId.includes('YOUR_')
);

let app;
let auth = null;
let db = null;
let storage = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log('🔥 Firebase initialized successfully.');
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
} else {
  console.warn(
    '⚙️ Firebase not configured — running in Simulated Mode.\n' +
    'Add your VITE_FIREBASE_* keys to .env to enable real authentication.'
  );
}

export { app, auth, db, storage, isFirebaseConfigured, onAuthStateChanged };
export default app;
