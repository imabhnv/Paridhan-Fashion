import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const keyLine = env.split('\n').find(l => l.startsWith('FIREBASE_SERVICE_ACCOUNT_KEY='));
const keyStr = keyLine.substring(keyLine.indexOf('=') + 1).replace(/^'|'$/g, '');
const serviceAccount = JSON.parse(keyStr);

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function check() {
  console.log('--- USERS ---');
  const users = await db.collection('users').get();
  users.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
  });

  console.log('--- BOUTIQUES ---');
  const boutiques = await db.collection('boutiques').get();
  boutiques.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
  });
}

check().catch(console.error);
