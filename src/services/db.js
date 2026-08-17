import { isFirebaseConfigured, db as firebaseDb } from './firebase';
import { 
  collection, doc, getDocs, getDoc, addDoc, updateDoc, query, where, setDoc, serverTimestamp, deleteDoc
} from 'firebase/firestore';
import { MOCK_PRODUCTS, MOCK_BOUTIQUES } from '../data/mockData';
// Initialize LocalStorage DB if needed
const initLocalDb = () => {
  // Clear out old mock products if they exist
  const existingProducts = JSON.parse(localStorage.getItem('paridhan_products') || '[]');
  if (existingProducts.length > 0 && existingProducts[0].id === 'prod-1') {
    localStorage.setItem('paridhan_products', JSON.stringify([]));
  } else if (!localStorage.getItem('paridhan_products')) {
    localStorage.setItem('paridhan_products', JSON.stringify([]));
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
  if (!localStorage.getItem('paridhan_contacts')) {
    localStorage.setItem('paridhan_contacts', JSON.stringify([]));
  }
};

initLocalDb();

export const dbService = {
  // --- PRODUCTS ---
  async getProducts() {
    if (isFirebaseConfigured) {
      try {
        const snap = await getDocs(collection(firebaseDb, 'products'));
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (err) {
        console.error("Firestore getProducts failed, falling back to LocalStorage:", err);
      }
    }
    return JSON.parse(localStorage.getItem('paridhan_products') || '[]');
  },

  async getProduct(id) {
    if (isFirebaseConfigured) {
      try {
        const snap = await getDoc(doc(firebaseDb, 'products', id));
        if (snap.exists()) return { id: snap.id, ...snap.data() };
      } catch (err) {
        console.error("Firestore getProduct failed, falling back to LocalStorage:", err);
      }
    }
    const products = JSON.parse(localStorage.getItem('paridhan_products') || '[]');
    return products.find(p => p.id === id) || null;
  },

  async addProduct(product) {
    if (isFirebaseConfigured) {
      try {
        const docRef = await addDoc(collection(firebaseDb, 'products'), product);
        return { id: docRef.id, ...product };
      } catch (err) {
        console.error("Firestore addProduct failed, using LocalStorage:", err);
      }
    }
    const products = JSON.parse(localStorage.getItem('paridhan_products') || '[]');
    const newProduct = { ...product, id: `prod-${Date.now()}` };
    products.push(newProduct);
    localStorage.setItem('paridhan_products', JSON.stringify(products));
    return newProduct;
  },

  async updateProduct(id, updates) {
    if (isFirebaseConfigured) {
      try {
        await updateDoc(doc(firebaseDb, 'products', id), updates);
        return true;
      } catch (err) {
        console.error("Firestore updateProduct failed:", err);
        throw err;
      }
    }
    const products = JSON.parse(localStorage.getItem('paridhan_products') || '[]');
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...updates };
      localStorage.setItem('paridhan_products', JSON.stringify(products));
      return true;
    }
    return false;
  },

  async deleteProduct(id) {
    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(firebaseDb, 'products', id));
        return true;
      } catch (err) {
        console.error("Firestore deleteProduct failed:", err);
        throw err;
      }
    }
    let products = JSON.parse(localStorage.getItem('paridhan_products') || '[]');
    const originalLength = products.length;
    products = products.filter(p => p.id !== id);
    if (products.length < originalLength) {
      localStorage.setItem('paridhan_products', JSON.stringify(products));
      return true;
    }
    return false;
  },

  // --- BOUTIQUES ---
  async getBoutiques() {
    const blacklist = JSON.parse(localStorage.getItem('paridhan_deleted_ids') || '[]');
    if (isFirebaseConfigured) {
      try {
        const snap = await getDocs(collection(firebaseDb, 'boutiques'));
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        return docs.filter(d => !blacklist.includes(d.id) && !blacklist.includes(d.ownerId));
      } catch (err) {
        console.error("Firestore getBoutiques failed, using LocalStorage:", err);
      }
    }
    return JSON.parse(localStorage.getItem('paridhan_boutiques') || '[]').filter(d => !blacklist.includes(d.id) && !blacklist.includes(d.ownerId));
  },

  async getVerifiedBoutiques() {
    const blacklist = JSON.parse(localStorage.getItem('paridhan_deleted_ids') || '[]');
    if (isFirebaseConfigured) {
      try {
        const q = query(collection(firebaseDb, 'boutiques'), where("verified", "==", true));
        const snap = await getDocs(q);
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        return docs.filter(d => !blacklist.includes(d.id) && !blacklist.includes(d.ownerId));
      } catch (err) {
        console.error("Firestore getVerifiedBoutiques failed, using LocalStorage:", err);
      }
    }
    const boutiques = JSON.parse(localStorage.getItem('paridhan_boutiques') || '[]');
    return boutiques.filter(b => b.verified === true && !blacklist.includes(b.id) && !blacklist.includes(b.ownerId));
  },

  async getBoutique(id) {
    if (isFirebaseConfigured) {
      try {
        const snap = await getDoc(doc(firebaseDb, 'boutiques', id));
        if (snap.exists()) return { id: snap.id, ...snap.data() };
      } catch (err) {
        console.error("Firestore getBoutique failed, using LocalStorage:", err);
      }
    }
    const boutiques = JSON.parse(localStorage.getItem('paridhan_boutiques') || '[]');
    return boutiques.find(b => b.id === id) || null;
  },

  async updateBoutique(id, updates) {
    if (isFirebaseConfigured) {
      try {
        await updateDoc(doc(firebaseDb, 'boutiques', id), updates);
        return true;
      } catch (err) {
        console.error("Firestore updateBoutique failed, using LocalStorage:", err);
      }
    }
    const boutiques = JSON.parse(localStorage.getItem('paridhan_boutiques') || '[]');
    const idx = boutiques.findIndex(b => b.id === id);
    if (idx !== -1) {
      boutiques[idx] = { ...boutiques[idx], ...updates };
      localStorage.setItem('paridhan_boutiques', JSON.stringify(boutiques));
      return true;
    }
    return false;
  },

  // --- ORDERS / BOOKINGS ---
  async getOrders(filters = {}) {
    if (isFirebaseConfigured) {
      try {
        let q = collection(firebaseDb, 'orders');
        if (filters.userId) {
          q = query(q, where('userId', '==', filters.userId));
        } else if (filters.storeId) {
          q = query(q, where('storeId', '==', filters.storeId));
        }
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (err) {
        console.error("Firestore getOrders failed, using LocalStorage:", err);
      }
    }
    let orders = JSON.parse(localStorage.getItem('paridhan_orders') || '[]');
    if (filters.userId) {
      orders = orders.filter(o => o.userId === filters.userId);
    }
    if (filters.storeId) {
      orders = orders.filter(o => o.storeId === filters.storeId);
    }
    return orders;
  },

  async createOrder(orderData) {
    const newOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "Confirmed", // Initial lifecycle state
      timeline: [
        { status: "Confirmed", date: new Date().toISOString(), label: "Order Confirmed", desc: "Payment received. Outfit reservation locked." }
      ]
    };

    if (isFirebaseConfigured) {
      try {
        const docRef = await addDoc(collection(firebaseDb, 'orders'), newOrder);
        return { id: docRef.id, ...newOrder };
      } catch (err) {
        console.error("Firestore createOrder failed, saving to LocalStorage:", err);
      }
    }

    // Save to LocalStorage
    const orders = JSON.parse(localStorage.getItem('paridhan_orders') || '[]');
    orders.push(newOrder);
    localStorage.setItem('paridhan_orders', JSON.stringify(orders));

    // Update Product Booked Dates to avoid scheduling conflicts
    const products = JSON.parse(localStorage.getItem('paridhan_products') || '[]');
    const pIdx = products.findIndex(p => p.id === orderData.productId);
    if (pIdx !== -1) {
      const currentBooked = products[pIdx].bookedDates || [];
      // Calculate rental date range
      const dates = [];
      let current = new Date(orderData.startDate);
      const end = new Date(orderData.endDate);
      while (current <= end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }
      products[pIdx].bookedDates = [...new Set([...currentBooked, ...dates])];
      localStorage.setItem('paridhan_products', JSON.stringify(products));
    }

    return newOrder;
  },

  async updateOrder(id, updates) {
    if (isFirebaseConfigured) {
      try {
        await updateDoc(doc(firebaseDb, 'orders', id), updates);
        return true;
      } catch (err) {
        console.error("Firestore updateOrder failed, using LocalStorage:", err);
      }
    }

    const orders = JSON.parse(localStorage.getItem('paridhan_orders') || '[]');
    const idx = orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      // Append timeline step if status is changing
      let newTimeline = orders[idx].timeline || [];
      if (updates.status && updates.status !== orders[idx].status) {
        let label = updates.status;
        let desc = "Order status updated.";
        if (updates.status === "Out for Delivery") {
          label = "Out for Delivery";
          desc = "Our logistics partner has picked up your outfit. It is on its way.";
        } else if (updates.status === "Delivered") {
          label = "Delivered";
          desc = "Outfit successfully delivered. Please check the fit and report any damage within 4 hours.";
        } else if (updates.status === "Return Pending") {
          label = "Return Pending";
          desc = "Return pickup is scheduled. Please pack the outfit in the original box.";
        } else if (updates.status === "Cleaning") {
          label = "Undergoing Professional Sanitization";
          desc = "Outfit received by boutique and sent for our strict 5-stage dry cleaning and UV sanitization.";
        } else if (updates.status === "Available Again") {
          label = "Available Again";
          desc = "Outfit sanitized, inspected, and restocked in inventory.";
        }
        newTimeline.push({
          status: updates.status,
          date: new Date().toISOString(),
          label,
          desc
        });
      }

      orders[idx] = { 
        ...orders[idx], 
        ...updates, 
        timeline: newTimeline.length > 0 ? newTimeline : orders[idx].timeline 
      };
      localStorage.setItem('paridhan_orders', JSON.stringify(orders));
      return true;
    }
    return false;
  },

  // --- DISPUTES ---
  async getDisputes() {
    return JSON.parse(localStorage.getItem('paridhan_disputes') || '[]');
  },

  async fileDispute(disputeData) {
    const disputes = JSON.parse(localStorage.getItem('paridhan_disputes') || '[]');
    const newDispute = {
      ...disputeData,
      id: `disp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "Open"
    };
    disputes.push(newDispute);
    localStorage.setItem('paridhan_disputes', JSON.stringify(disputes));
    return newDispute;
  },

  async resolveDispute(id, status, resolutionNotes) {
    const disputes = JSON.parse(localStorage.getItem('paridhan_disputes') || '[]');
    const idx = disputes.findIndex(d => d.id === id);
    if (idx !== -1) {
      disputes[idx] = { ...disputes[idx], status, resolutionNotes, resolvedAt: new Date().toISOString() };
      localStorage.setItem('paridhan_disputes', JSON.stringify(disputes));
      return id;
    }
    
    return "DISP-MOCK-789";
  },

  // --- CONTACT REQUESTS ---
  async submitContactRequest(data) {
    if (isFirebaseConfigured) {
      try {
        const docRef = await addDoc(collection(firebaseDb, 'contactRequests'), {
          ...data,
          status: 'pending',
          createdAt: serverTimestamp()
        });
        return docRef.id;
      } catch (err) {
        console.error("Firestore submitContactRequest failed, falling back to LocalStorage:", err);
      }
    }
    
    // Fallback to local storage
    const reqs = JSON.parse(localStorage.getItem('paridhan_contacts') || '[]');
    const newReq = { 
      id: `REQ-${Date.now()}`,
      ...data, 
      status: 'pending',
      createdAt: new Date().toISOString() 
    };
    reqs.push(newReq);
    localStorage.setItem('paridhan_contacts', JSON.stringify(reqs));
    return newReq.id;
  },

  async deleteUserCompletely(uid, role, boutiqueId) {
    const blacklist = JSON.parse(localStorage.getItem('paridhan_deleted_ids') || '[]');
    if (uid && !blacklist.includes(uid)) blacklist.push(uid);
    if (boutiqueId && !blacklist.includes(boutiqueId)) blacklist.push(boutiqueId);
    localStorage.setItem('paridhan_deleted_ids', JSON.stringify(blacklist));

    if (isFirebaseConfigured) {
      if (uid) {
        await deleteDoc(doc(firebaseDb, 'users', uid)).catch(() => {});
      }
      if (role === 'store' && boutiqueId) {
        await deleteDoc(doc(firebaseDb, 'boutiques', boutiqueId)).catch(() => {});
      }
      return true;
    }
    // LocalStorage fallback for simulated mode
    const users = JSON.parse(localStorage.getItem('paridhan_users') || '[]');
    localStorage.setItem('paridhan_users', JSON.stringify(users.filter(u => u.uid !== uid)));
    
    if (role === 'store' && boutiqueId) {
      const boutiques = JSON.parse(localStorage.getItem('paridhan_boutiques') || '[]');
      localStorage.setItem('paridhan_boutiques', JSON.stringify(boutiques.filter(b => b.id !== boutiqueId)));
    }
    return true;
  }
};

/**
 * Creates a boutique/store record in Firestore (or localStorage fallback).
 * Called during store owner signup. Returns the boutique document ID.
 */
export const createBoutiqueRecord = async (data) => {
  const boutiqueData = {
    name: data.name || 'My Atelier',
    ownerId: data.ownerId,
    logo: '',
    coverImage: '',
    rating: 5.0,
    reviewsCount: 0,
    location: data.location || 'India',
    description: data.description || 'Luxury boutique fashion store.',
    verified: false,
    joinedDate: new Date().toLocaleString('default', { month: 'short', year: 'numeric' }),
    totalBookings: 0,
    createdAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured && firebaseDb) {
    try {
      const docRef = await addDoc(collection(firebaseDb, 'boutiques'), boutiqueData);
      return docRef.id;
    } catch (err) {
      console.error('createBoutiqueRecord Firestore failed:', err);
    }
  }

  // localStorage fallback
  const boutiqueId = `boutique-${Date.now()}`;
  const boutiques = JSON.parse(localStorage.getItem('paridhan_boutiques') || '[]');
  boutiques.push({ id: boutiqueId, ...boutiqueData });
  localStorage.setItem('paridhan_boutiques', JSON.stringify(boutiques));
  return boutiqueId;
};

export default dbService;
