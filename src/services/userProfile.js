import { db, isFirebaseConfigured } from './firebase';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  getDocs
} from 'firebase/firestore';

/**
 * Creates or merges a user profile document in Firestore.
 * Safe to call on every login — uses setDoc with merge:true so it won't
 * overwrite existing data if the document already exists.
 */
export const createUserProfile = async (uid, data) => {
  if (!isFirebaseConfigured || !db) return null;
  try {
    const userRef = doc(db, 'users', uid);
    
    // First try to check if it exists so we don't trigger update rules on a non-existent doc
    const snap = await getDoc(userRef);
    const now = new Date().toISOString();
    if (snap.exists()) {
      await setDoc(userRef, { ...data, updatedAt: now }, { merge: true });
    } else {
      await setDoc(userRef, { createdAt: now, updatedAt: now, ...data, uid });
    }
    return { uid, ...data };
  } catch (err) {
    console.error('createUserProfile error:', err);
    return null;
  }
};

/**
 * Fetches a user profile from Firestore by UID.
 * Returns null if not found or Firebase is not configured.
 */
export const getUserProfile = async (uid) => {
  if (!isFirebaseConfigured || !db) {
    // Fallback to localStorage in simulated mode
    const users = JSON.parse(localStorage.getItem('paridhan_users') || '[]');
    return users.find((u) => u.uid === uid) || null;
  }
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return { uid: snap.id, ...snap.data() };
    }
    return null;
  } catch (err) {
    console.error('getUserProfile error:', err);
    return null;
  }
};

/**
 * Updates specific fields of a user profile in Firestore.
 * Merges updates so unspecified fields are preserved.
 */
export const updateUserProfile = async (uid, updates) => {
  if (!isFirebaseConfigured || !db) {
    // Fallback to localStorage in simulated mode
    const users = JSON.parse(localStorage.getItem('paridhan_users') || '[]');
    const idx = users.findIndex((u) => u.uid === uid);
    if (idx !== -1) {
      const updated = { ...users[idx], ...updates };
      users[idx] = updated;
      localStorage.setItem('paridhan_users', JSON.stringify(users));
      const session = JSON.parse(localStorage.getItem('paridhan_session') || '{}');
      if (session.uid === uid) {
        localStorage.setItem('paridhan_session', JSON.stringify(updated));
      }
      return updated;
    }
    return null;
  }
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (err) {
    console.error('updateUserProfile error:', err);
    return null;
  }
};

/**
 * Fetches all registered users (customers and stores).
 */
export const getAllUsers = async () => {
  const blacklist = JSON.parse(localStorage.getItem('paridhan_deleted_ids') || '[]');
  if (!isFirebaseConfigured || !db) {
    // Fallback to localStorage in simulated mode
    const users = JSON.parse(localStorage.getItem('paridhan_users') || '[]');
    return users.filter(u => !blacklist.includes(u.uid));
  }
  try {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map(doc => ({ uid: doc.id, ...doc.data() })).filter(u => !blacklist.includes(u.uid));
  } catch (err) {
    console.error('getAllUsers error:', err);
    // Fallback to LocalStorage if Firestore blocks the read
    const users = JSON.parse(localStorage.getItem('paridhan_users') || '[]');
    return users.filter(u => !blacklist.includes(u.uid));
  }
};
