import * as admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
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
    if (admin.apps.length) {
      await admin.auth().deleteUser(uid);
    } else {
      console.warn("FIREBASE_SERVICE_ACCOUNT_KEY is missing. Skipping Auth deletion.");
    }

    // 2. Delete from Firestore
    if (admin.apps.length) {
      const db = admin.firestore();
      
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
