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

async function cleanOrphanedProducts() {
  try {
    console.log("Fetching active boutiques...");
    const boutiquesSnap = await db.collection('boutiques').get();
    const activeBoutiqueIds = new Set();
    boutiquesSnap.forEach(doc => {
      activeBoutiqueIds.add(doc.id);
    });

    console.log(`Found ${activeBoutiqueIds.size} active boutiques.`);

    console.log("Fetching products...");
    const productsSnap = await db.collection('products').get();
    
    let deletedCount = 0;
    
    for (const doc of productsSnap.docs) {
      const data = doc.data();
      if (!activeBoutiqueIds.has(data.storeId)) {
        console.log(`Deleting orphaned product: ${data.title} (ID: ${doc.id})`);
        await db.collection('products').doc(doc.id).delete();
        deletedCount++;
      }
    }

    console.log(`\nCleanup complete! Deleted ${deletedCount} orphaned products.`);
  } catch (err) {
    console.error('Error during cleanup:', err);
  }
  process.exit(0);
}

cleanOrphanedProducts();
