import { isFirebaseConfigured, auth as firebaseAuth } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

// Seed initial users for Simulated Mode
const initLocalUsers = () => {
  if (!localStorage.getItem('paridhan_users')) {
    const defaultUsers = [
      {
        uid: "user-cust",
        email: "customer@paridhan.com",
        password: "password123",
        displayName: "Varshil Shah",
        role: "customer",
        phone: "+91 98765 43210",
        photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
        addresses: [
          { id: "addr-1", type: "Home", street: "Flat 402, Signature Heights", city: "Mumbai", state: "Maharashtra", zip: "400053", default: true }
        ],
        balance: 10000,
        createdAt: new Date().toISOString()
      },
      {
        uid: "user-store",
        email: "boutique@paridhan.com",
        password: "password123",
        displayName: "Sabyasachi Mukherjee",
        role: "store",
        boutiqueId: "boutique-1",
        phone: "+91 99999 88888",
        photoURL: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=150&h=150&q=80",
        balance: 45000,
        createdAt: new Date().toISOString()
      },
      {
        uid: "user-admin",
        email: "admin@paridhan.com",
        password: "password123",
        displayName: "Paridhan Admin",
        role: "admin",
        phone: "+91 90000 11111",
        photoURL: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80",
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('paridhan_users', JSON.stringify(defaultUsers));
  }
};

initLocalUsers();

export const authService = {
  // Login
  async login(email, password) {
    if (isFirebaseConfigured) {
      try {
        const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
        // In real Firebase, you'd fetch the user's role from firestore. We simulate that by reading user metadata.
        const userDoc = localStorage.getItem(`firebase_role_${cred.user.uid}`);
        const role = userDoc ? JSON.parse(userDoc).role : 'customer';
        return {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName || email.split('@')[0],
          role,
          photoURL: cred.user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"
        };
      } catch (err) {
        throw new Error(err.message || "Failed to log in via Firebase");
      }
    }

    // Simulated Mode
    const users = JSON.parse(localStorage.getItem('paridhan_users') || '[]');
    const match = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!match) {
      throw new Error("Invalid email or password");
    }
    
    // Create session
    localStorage.setItem('paridhan_session', JSON.stringify(match));
    return match;
  },

  // Signup
  async signup(email, password, displayName, role = "customer", extraDetails = {}) {
    if (isFirebaseConfigured) {
      try {
        const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        const newUser = {
          uid: cred.user.uid,
          email,
          displayName,
          role,
          photoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
          ...extraDetails
        };
        // Store role locally or simulate firestore storage
        localStorage.setItem(`firebase_role_${cred.user.uid}`, JSON.stringify(newUser));
        return newUser;
      } catch (err) {
        throw new Error(err.message || "Failed to sign up via Firebase");
      }
    }

    // Simulated Mode
    const users = JSON.parse(localStorage.getItem('paridhan_users') || '[]');
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error("Email already registered");
    }

    const newUser = {
      uid: `user-${Date.now()}`,
      email,
      password,
      displayName,
      role,
      phone: extraDetails.phone || "",
      photoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
      addresses: [],
      balance: 0,
      createdAt: new Date().toISOString(),
      ...extraDetails
    };

    // If registering as store, add new boutique record
    if (role === 'store') {
      newUser.boutiqueId = `boutique-${Date.now()}`;
      const boutiques = JSON.parse(localStorage.getItem('paridhan_boutiques') || '[]');
      boutiques.push({
        id: newUser.boutiqueId,
        name: extraDetails.boutiqueName || `${displayName}'s Atelier`,
        logo: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=150&h=150&q=80",
        coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
        rating: 5.0,
        reviewsCount: 0,
        location: extraDetails.boutiqueLocation || "India",
        description: extraDetails.boutiqueDescription || "Luxury boutique fashion store.",
        verified: false,
        joinedDate: new Date().toLocaleString('default', { month: 'short', year: 'numeric' }),
        totalBookings: 0
      });
      localStorage.setItem('paridhan_boutiques', JSON.stringify(boutiques));
    }

    users.push(newUser);
    localStorage.setItem('paridhan_users', JSON.stringify(users));
    localStorage.setItem('paridhan_session', JSON.stringify(newUser));
    return newUser;
  },

  // Google Login
  async loginWithGoogle() {
    if (isFirebaseConfigured) {
      try {
        const provider = new GoogleAuthProvider();
        const cred = await signInWithPopup(firebaseAuth, provider);
        const userDoc = localStorage.getItem(`firebase_role_${cred.user.uid}`);
        const role = userDoc ? JSON.parse(userDoc).role : 'customer';
        return {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName,
          role,
          photoURL: cred.user.photoURL
        };
      } catch (err) {
        throw new Error(err.message || "Failed to login with Google");
      }
    }

    // Simulated Mode
    const users = JSON.parse(localStorage.getItem('paridhan_users') || '[]');
    let googleUser = users.find(u => u.email === "google-user@paridhan.com");
    
    if (!googleUser) {
      googleUser = {
        uid: "user-google",
        email: "google-user@paridhan.com",
        displayName: "Rajesh Kumar (Google)",
        role: "customer",
        phone: "+91 99887 76655",
        photoURL: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
        addresses: [],
        balance: 5000,
        createdAt: new Date().toISOString()
      };
      users.push(googleUser);
      localStorage.setItem('paridhan_users', JSON.stringify(users));
    }

    localStorage.setItem('paridhan_session', JSON.stringify(googleUser));
    return googleUser;
  },

  // Logout
  async logout() {
    if (isFirebaseConfigured) {
      await signOut(firebaseAuth);
    }
    localStorage.removeItem('paridhan_session');
  },

  // Reset Password
  async resetPassword(email) {
    if (isFirebaseConfigured) {
      await sendPasswordResetEmail(firebaseAuth, email);
      return;
    }
    // Simulation just prints to console and returns
    console.log(`Password reset email simulated to ${email}`);
  },

  // Update Profile
  async updateProfile(uid, details) {
    if (isFirebaseConfigured) {
      // In real app, we update firestore user document. We reflect locally here.
      const localRole = localStorage.getItem(`firebase_role_${uid}`);
      if (localRole) {
        const uObj = JSON.parse(localRole);
        const updated = { ...uObj, ...details };
        localStorage.setItem(`firebase_role_${uid}`, JSON.stringify(updated));
      }
      return true;
    }

    const users = JSON.parse(localStorage.getItem('paridhan_users') || '[]');
    const idx = users.findIndex(u => u.uid === uid);
    if (idx !== -1) {
      const updated = { ...users[idx], ...details };
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
};
export default authService;
