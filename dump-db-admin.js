import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const lines = env.split('\n');
const getEnv = (key) => {
  const line = lines.find(l => l.trim().startsWith(key));
  if (!line) return '';
  const val = line.substring(line.indexOf('=') + 1).trim();
  if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
    return val.slice(1, -1);
  }
  return val;
};

const serviceAccountStr = getEnv('FIREBASE_SERVICE_ACCOUNT_KEY');
let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountStr);
  if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }
} catch(err) {
  console.error("Failed to parse service account key", err);
  process.exit(1);
}

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function dump() {
  try {
    const usersSnap = await db.collection('users').get();
    console.log('--- USERS ---');
    usersSnap.forEach(doc => {
      const data = doc.data();
      console.log(doc.id, { email: data.email, role: data.role, displayName: data.displayName });
    });

    const boutiquesSnap = await db.collection('boutiques').get();
    console.log('\n--- BOUTIQUES ---');
    boutiquesSnap.forEach(doc => {
      console.log(doc.id, { ownerId: doc.data().ownerId, name: doc.data().name });
    });
  } catch (err) {
    console.error('Error fetching data:', err);
  }
  process.exit(0);
}

dump();
