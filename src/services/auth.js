import { isFirebaseConfigured, auth as firebaseAuth } from './firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth';
import { createUserProfile, getUserProfile, updateUserProfile } from './userProfile';
import { createBoutiqueRecord } from './db';
import { MOCK_PRODUCTS, MOCK_BOUTIQUES } from '../data/mockData';

// ─────────────────────────────────────────────────────────────────
// Friendly error message mapper for Firebase Auth error codes
// ─────────────────────────────────────────────────────────────────
const friendlyError = (code) => {
  const map = {
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Incorrect email or password. Please try again.',
    'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many failed attempts. Please wait a moment and try again.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled. Please try again.',
    'auth/cancelled-popup-request': 'Another sign-in window is already open.',
    'auth/popup-blocked': 'Sign-in popup was blocked. Please allow popups for this site.',
    'auth/account-exists-with-different-credential':
      'An account with this email already exists using a different sign-in method.',
    'auth/network-request-failed':
      'Network error. Please check your internet connection and try again.',
    'auth/internal-error': 'An internal error occurred. Please try again.',
  };
  return map[code] || 'Authentication failed. Please try again.';
};

// ─────────────────────────────────────────────────────────────────
// Simulated Mode — localStorage fallback (used only when Firebase is not configured)
// Seeded with mock boutiques/products for catalog browsing
// ─────────────────────────────────────────────────────────────────
const initSimulatedDb = () => {
  if (!localStorage.getItem('paridhan_products')) {
    localStorage.setItem('paridhan_products', JSON.stringify(MOCK_PRODUCTS));
  }
  if (!localStorage.getItem('paridhan_boutiques')) {
    localStorage.setItem('paridhan_boutiques', JSON.stringify(MOCK_BOUTIQUES));
  }
  if (!localStorage.getItem('paridhan_orders')) {
    localStorage.setItem('paridhan_orders', JSON.stringify([]));
  }
  if (!localStorage.getItem('paridhan_disputes')) {
    localStorage.setItem('paridhan_disputes', JSON.stringify([]));
  }
};

// Only seed catalog data (NOT fake user accounts) in simulated mode
if (!isFirebaseConfigured) {
  initSimulatedDb();
}

// ─────────────────────────────────────────────────────────────────
// Auth Service
// ─────────────────────────────────────────────────────────────────
export const authService = {

  // ── Login ──────────────────────────────────────────────────────
  async login(email, password) {
    if (isFirebaseConfigured) {
      try {
        const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
        // Fetch role/profile from Firestore, update lastLoginAt
        let profile = await getUserProfile(cred.user.uid);
        if (profile) {
          await createUserProfile(cred.user.uid, { lastLoginAt: new Date().toISOString() });
        } else {
          // First time login (e.g. imported user) — create minimal profile
          profile = {
            uid: cred.user.uid,
            email: cred.user.email,
            displayName: cred.user.displayName || email.split('@')[0],
            photoURL: cred.user.photoURL || '',
            role: 'customer',
            provider: 'email',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
          };
          await createUserProfile(cred.user.uid, profile);
        }
        return profile;
      } catch (err) {
        throw new Error(friendlyError(err.code));
      }
    }

    // Simulated Mode
    const users = JSON.parse(localStorage.getItem('paridhan_users') || '[]');
    const match = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!match) throw new Error('No account found with this email address, or incorrect password.');
    localStorage.setItem('paridhan_session', JSON.stringify(match));
    return match;
  },

  // ── Signup ─────────────────────────────────────────────────────
  async signup(email, password, displayName, role = 'customer', extraDetails = {}) {
    if (isFirebaseConfigured) {
      try {
        const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);

        // Set Firebase display name
        await firebaseUpdateProfile(cred.user, { displayName });

        // Build Firestore user document
        const newUser = {
          uid: cred.user.uid,
          email,
          displayName,
          photoURL: '',
          role,
          provider: 'email',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          addresses: [],
          ...extraDetails,
        };

        // If store owner, create boutique document in Firestore
        if (role === 'store') {
          const boutiqueId = await createBoutiqueRecord({
            ownerId: cred.user.uid,
            name: extraDetails.boutiqueName || `${displayName}'s Atelier`,
            location: extraDetails.boutiqueLocation || 'India',
            description: extraDetails.boutiqueDescription || 'Luxury boutique fashion store.',
          });
          newUser.boutiqueId = boutiqueId;
        }

        await createUserProfile(cred.user.uid, newUser);
        return newUser;
      } catch (err) {
        throw new Error(friendlyError(err.code));
      }
    }

    // Simulated Mode
    const users = JSON.parse(localStorage.getItem('paridhan_users') || '[]');
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) throw new Error('This email is already registered. Please sign in instead.');

    const newUser = {
      uid: `user-${Date.now()}`,
      email,
      password,
      displayName,
      role,
      photoURL: '',
      addresses: [],
      balance: 0,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      ...extraDetails,
    };

    if (role === 'store') {
      newUser.boutiqueId = `boutique-${Date.now()}`;
      const boutiques = JSON.parse(localStorage.getItem('paridhan_boutiques') || '[]');
      boutiques.push({
        id: newUser.boutiqueId,
        name: extraDetails.boutiqueName || `${displayName}'s Atelier`,
        logo: '',
        coverImage: '',
        rating: 5.0,
        reviewsCount: 0,
        location: extraDetails.boutiqueLocation || 'India',
        description: extraDetails.boutiqueDescription || 'Luxury boutique fashion store.',
        verified: false,
        joinedDate: new Date().toLocaleString('default', { month: 'short', year: 'numeric' }),
        totalBookings: 0,
      });
      localStorage.setItem('paridhan_boutiques', JSON.stringify(boutiques));
    }

    users.push(newUser);
    localStorage.setItem('paridhan_users', JSON.stringify(users));
    localStorage.setItem('paridhan_session', JSON.stringify(newUser));
    return newUser;
  },

  // ── Google Sign-In ─────────────────────────────────────────────
  async loginWithGoogle() {
    if (isFirebaseConfigured) {
      try {
        const provider = new GoogleAuthProvider();
        // Add scopes for better profile data
        provider.addScope('profile');
        provider.addScope('email');
        const cred = await signInWithPopup(firebaseAuth, provider);

        // Check if user already has a profile
        let profile = await getUserProfile(cred.user.uid);
        const now = new Date().toISOString();

        if (profile) {
          // Update last login
          await createUserProfile(cred.user.uid, { lastLoginAt: now });
          profile = { ...profile, lastLoginAt: now };
        } else {
          // First time Google login — create profile
          profile = {
            uid: cred.user.uid,
            email: cred.user.email,
            displayName: cred.user.displayName || cred.user.email.split('@')[0],
            photoURL: cred.user.photoURL || '',
            role: 'customer',
            provider: 'google',
            createdAt: now,
            lastLoginAt: now,
            addresses: [],
          };
          await createUserProfile(cred.user.uid, profile);
        }
        return profile;
      } catch (err) {
        throw new Error(friendlyError(err.code));
      }
    }

    // Simulated Mode — create a demo google session
    const users = JSON.parse(localStorage.getItem('paridhan_users') || '[]');
    let googleUser = users.find((u) => u.email === 'google-demo@paridhan.local');
    if (!googleUser) {
      googleUser = {
        uid: 'user-google-demo',
        email: 'google-demo@paridhan.local',
        displayName: 'Demo Google User',
        role: 'customer',
        photoURL: '',
        addresses: [],
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        provider: 'google',
        _isSimulated: true,
      };
      users.push(googleUser);
      localStorage.setItem('paridhan_users', JSON.stringify(users));
    }
    localStorage.setItem('paridhan_session', JSON.stringify(googleUser));
    return googleUser;
  },

  // ── Logout ─────────────────────────────────────────────────────
  async logout() {
    if (isFirebaseConfigured && firebaseAuth) {
      await signOut(firebaseAuth);
    }
    localStorage.removeItem('paridhan_session');
  },

  // ── Reset Password ─────────────────────────────────────────────
  async resetPassword(email) {
    if (isFirebaseConfigured) {
      try {
        await sendPasswordResetEmail(firebaseAuth, email);
      } catch (err) {
        throw new Error(friendlyError(err.code));
      }
      return;
    }
    // Simulated mode — just resolve silently
    console.log(`[Simulated] Password reset email sent to: ${email}`);
  },

  // ── Update Profile ─────────────────────────────────────────────
  async updateProfile(uid, details) {
    // Update Firestore / localStorage via userProfile service
    return await updateUserProfile(uid, details);
  },
};

export default authService;
