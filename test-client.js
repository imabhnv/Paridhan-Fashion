import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const lines = env.split('\n');
const getEnv = (key) => {
  const line = lines.find(l => l.startsWith(key + '='));
  if (!line) return '';
  return line.substring(line.indexOf('=') + 1).replace(/^"|"$/g, '').trim();
};

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID')
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function test() {
  const testEmail = `test${Date.now()}@test.com`;
  console.log('Creating user:', testEmail);
  const cred = await createUserWithEmailAndPassword(auth, testEmail, 'password123');
  console.log('User created:', cred.user.uid);

  try {
    console.log('Testing createBoutiqueRecord...');
    const bData = { ownerId: cred.user.uid, name: 'Test Boutique' };
    const bRef = await addDoc(collection(db, 'boutiques'), bData);
    console.log('Boutique created:', bRef.id);
  } catch (err) {
    console.error('Boutique create error:', err.message);
  }

  try {
    console.log('Testing createUserProfile (setDoc with merge)...');
    const uData = { uid: cred.user.uid, email: testEmail, role: 'store' };
    await setDoc(doc(db, 'users', cred.user.uid), uData, { merge: true });
    console.log('User profile created successfully.');
  } catch (err) {
    console.error('User profile create error:', err.message);
  }
}

test().catch(console.error);
