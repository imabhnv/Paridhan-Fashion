import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBDLgeWmdg-4TcFTjA058zzvBmYDIu7R_A',
  authDomain: 'paridhan-fashion.firebaseapp.com',
  projectId: 'paridhan-fashion',
  storageBucket: 'paridhan-fashion.firebasestorage.app',
  messagingSenderId: '381083164999',
  appId: '1:381083164999:web:895c1424096126f72eac62'
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
