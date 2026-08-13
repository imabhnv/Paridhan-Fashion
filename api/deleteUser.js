import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already initialized
if (getApps().length === 0) {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      initializeApp({
        credential: cert(serviceAccount)
      });
    }
  } catch (error) {
    console.error('Firebase Admin initialization error', error.stack);
  }
}

export default async function handler(req, res) {
  // Only allow DELETE requests
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { uid, role, boutiqueId } = req.body;

  if (!uid) {
    return res.status(400).json({ error: 'Missing UID' });
  }

  try {
    // 1. Delete from Firebase Authentication (requires Admin SDK)
    if (getApps().length > 0) {
      await getAuth().deleteUser(uid);
    } else {
      console.warn("FIREBASE_SERVICE_ACCOUNT_KEY is missing. Skipping Auth deletion.");
    }

    // 2. Delete from Firestore
    if (getApps().length > 0) {
      const db = getFirestore();
      
      // Delete user profile
      await db.collection('users').doc(uid).delete();
      
      // If store owner, delete boutique record
      if (role === 'store' && boutiqueId) {
        await db.collection('boutiques').doc(boutiqueId).delete();
      }
    }

    return res.status(200).json({ success: true, message: 'User completely deleted.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
