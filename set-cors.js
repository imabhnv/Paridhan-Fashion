import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import process from 'process';

process.loadEnvFile();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

const app = initializeApp({
  credential: cert(serviceAccount)
});

async function listBuckets() {
  try {
    const storageClient = getStorage(app);
    const [buckets] = await storageClient.bucket('dummy').storage.getBuckets();
    console.log('Available buckets:');
    buckets.forEach(bucket => {
      console.log(bucket.name);
    });
  } catch (error) {
    console.error('Failed to list buckets:', error);
  }
}

listBuckets();
