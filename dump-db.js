import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBDLgeWmdg-4TcFTjA058zzvBmYDIu7R_A',
  authDomain: 'paridhan-fashion.firebaseapp.com',
  projectId: 'paridhan-fashion',
  storageBucket: 'paridhan-fashion.firebasestorage.app',
  messagingSenderId: '381083164999',
  appId: '1:381083164999:web:895c1424096126f72eac62'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function dump() {
  try {
    const usersSnap = await getDocs(collection(db, 'users'));
    console.log('--- USERS ---');
    usersSnap.forEach(doc => {
      console.log(doc.id, doc.data());
    });

    const boutiquesSnap = await getDocs(collection(db, 'boutiques'));
    console.log('\n--- BOUTIQUES ---');
    boutiquesSnap.forEach(doc => {
      console.log(doc.id, doc.data());
    });
  } catch (err) {
    console.error('Error fetching data:', err);
  }
  process.exit(0);
}

dump();
