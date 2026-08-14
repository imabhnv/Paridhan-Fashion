import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const lines = env.split('\n');
const getEnv = (key) => {
  const line = lines.find(l => l.trim().startsWith(key));
  if (!line) return '';
  return line.split('=')[1].replace(/^["']|["']$/g, '').trim();
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
  const testEmail = `test_${Date.now()}@test.com`;
  console.log('Creating user:', testEmail);
  const cred = await createUserWithEmailAndPassword(auth, testEmail, 'password123');
  const uid = cred.user.uid;
  console.log('User created in Auth:', uid);

  try {
    console.log('Testing createBoutiqueRecord...');
    const bData = { ownerId: uid, name: 'Test Boutique' };
    const bRef = await addDoc(collection(db, 'boutiques'), bData);
    console.log('Boutique created in Firestore:', bRef.id);
  } catch (err) {
    console.error('Boutique create error:', err.message);
  }

  try {
    console.log('Testing createUserProfile...');
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    const uData = { uid, email: testEmail, role: 'store' };
    if (snap.exists()) {
      await setDoc(userRef, uData, { merge: true });
      console.log('User profile merged.');
    } else {
      await setDoc(userRef, uData);
      console.log('User profile created.');
    }
  } catch (err) {
    console.error('User profile create error:', err.message);
  }
  
  process.exit(0);
}

test().catch(console.error);
