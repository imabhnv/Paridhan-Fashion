import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  User, MapPin, Calendar, Heart, ShieldAlert, Edit2, CheckCircle2, ShieldCheck, Ticket, Plus, Trash2 
} from 'lucide-react';
import dbService from '../services/db';
import { getAllUsers } from '../services/userProfile';
import SeoHelper from '../components/SeoHelper';

const CustomerDashboard = () => {
  const { user, updateProfile } = useAuth();
  const { toggleWishlist, isInWishlist } = useCart();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'bookings';

  // Tabs: 'bookings' | 'wishlist' | 'addresses' | 'profile' | 'disputes'
  const [activeTab, setActiveTab] = useState(initialTab);
  const [bookings, setBookings] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [disputes, setDisputes] = useState([]);

  // Edit states
  const [name, setName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Admin Impersonation State
  const [adminCustomers, setAdminCustomers] = useState([]);
  const [selectedAdminCustomerId, setSelectedAdminCustomerId] = useState(null);

  // Dispute Filing states
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeDescription, setDisputeDescription] = useState('');
  const [disputeSuccess, setDisputeSuccess] = useState('');

  // Address Modal specific
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newZip, setNewZip] = useState('');
  const [newType, setNewType] = useState('Home');

  const loadDashboardData = async () => {
    if (!user) return;
    
    // Admin Impersonation Mode
    if (user.role === 'admin' && !selectedAdminCustomerId) {
      const allUsers = await getAllUsers();
      // Filter out admins and stores, only show customers
      setAdminCustomers(allUsers.filter(u => u.role === 'customer' || !u.role));
      return;
    }

    const targetUserId = user.role === 'admin' ? selectedAdminCustomerId : user.uid;
    if (!targetUserId) return;

    // Load customer orders
    const ordersData = await dbService.getOrders({ userId: targetUserId });
    setBookings(ordersData);

    // Load wishlist objects (assuming wishlist is in localStorage for local users, 
    // but for an admin viewing a customer, this is tricky. We'll just show empty for now, 
    // or keep the local logic since wishlist isn't stored in Firebase currently).
    const allProds = await dbService.getProducts();
    const wishIds = JSON.parse(localStorage.getItem('paridhan-wishlist') || '[]');
    const wishData = allProds.filter(p => wishIds.includes(p.id));
    setWishlistItems(wishData);

    // Load disputes
    const dispData = await dbService.getDisputes();
    const clientDisps = dispData.filter(d => d.userId === targetUserId);
    setDisputes(clientDisps);
  };

  useEffect(() => {
    loadDashboardData();
  }, [user, activeTab, selectedAdminCustomerId]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    try {
      await updateProfile({ displayName: name, phone });
      setProfileSuccess('✅ Profile updated successfully.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const newAddr = {
      id: `addr-${Date.now()}`,
      street: newStreet,
      city: newCity,
      state: newState,
      zip: newZip,
      type: newType,
      default: (user?.addresses || []).length === 0
    };
    const updated = [...(user?.addresses || []), newAddr];
    await updateProfile({ addresses: updated });
    setAddressModalOpen(false);
    // Reset Form
    setNewStreet('');
    setNewCity('');
    setNewState('');
    setNewZip('');
  };

  const handleRemoveAddress = async (id) => {
    const updated = user.addresses.filter(a => a.id !== id);
    await updateProfile({ addresses: updated });
  };

  const handleFileDispute = async (e) => {
    e.preventDefault();
    if (!selectedBookingId || !disputeReason) return;
    
    const matchedBooking = bookings.find(b => b.id === selectedBookingId);

    const disputeData = {
      userId: user.uid,
      userName: user.displayName,
      userEmail: user.email,
      bookingId: selectedBookingId,
      productTitle: matchedBooking.productTitle,
      storeId: matchedBooking.storeId,
      storeName: matchedBooking.storeName,
      reason: disputeReason,
      description: disputeDescription,
    };

    await dbService.fileDispute(disputeData);
    setDisputeSuccess('✅ Dispute filed successfully. Paridhan claims desk will audit this within 24 hours.');
    setSelectedBookingId('');
    setDisputeReason('');
    setDisputeDescription('');
    loadDashboardData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left animate-fade-in">
      
      <SeoHelper title="My Atelier Dashboard" description="Manage your luxury rental bookings, profile measurements, addresses, and wishlist." />

      {user?.role === 'admin' && !selectedAdminCustomerId ? (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight text-luxury-charcoal dark:text-white">Admin: Select Customer to Manage</h1>
          <p className="text-sm font-light text-luxury-charcoal/50 dark:text-luxury-alabaster/50">
            Choose a customer account to view their dashboard.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminCustomers.map(customer => (
              <div key={customer.uid} className="bg-white dark:bg-luxury-lightcharcoal p-6 rounded-xl border border-luxury-gold/15 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-playfair text-lg font-bold dark:text-white">{customer.displayName || customer.email}</h3>
                  <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 uppercase tracking-widest mt-1">
                    Role: {customer.role || 'customer'}
                  </p>
                </div>
                <div className="pt-4 border-t border-luxury-gold/10">
                  <button 
                    onClick={() => setSelectedAdminCustomerId(customer.uid)}
                    className="w-full py-2 bg-luxury-gold text-white text-[10px] font-bold tracking-widest uppercase rounded hover:bg-luxury-bronze transition-colors"
                  >
                    Manage Customer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="border-b border-luxury-gold/20 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-luxury-charcoal dark:text-white">Atelier Dashboard</h1>
              <p className="text-sm font-light text-luxury-charcoal/50 dark:text-luxury-alabaster/50 mt-1 flex items-center">
                <span>Account: <strong className="font-semibold text-luxury-gold">{user?.role === 'admin' ? selectedAdminCustomerId.slice(0,8) + '...' : user?.displayName}</strong></span>
                {user?.role === 'admin' && (
                  <button onClick={() => setSelectedAdminCustomerId(null)} className="ml-4 px-2 py-1 bg-luxury-gold/10 text-luxury-gold rounded text-[10px] uppercase font-bold tracking-widest hover:bg-luxury-gold/20 transition-colors">
                    &larr; Switch Customer
                  </button>
                )}
              </p>
            </div>
            <div className="bg-luxury-cream border border-luxury-gold/30 px-4 py-2 rounded-lg text-xs font-semibold text-luxury-charcoal flex items-center">
              <Ticket size={14} className="text-luxury-gold mr-1.5" /> Customer Account
            </div>
          </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2 bg-white dark:bg-luxury-lightcharcoal rounded-xl border border-luxury-gold/15 p-5 shadow-sm">
          {[
            { id: 'bookings', label: 'My Bookings', badge: bookings.length },
            { id: 'wishlist', label: 'My Wishlist', badge: wishlistItems.length },
            { id: 'addresses', label: 'Saved Addresses', badge: user?.addresses?.length || 0 },
            { id: 'disputes', label: 'Disputes & Claims', badge: disputes.length },
            { id: 'profile', label: 'Profile Settings' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-left rounded-md flex items-center justify-between transition-all ${
                activeTab === tab.id
                  ? 'bg-luxury-gold text-white'
                  : 'text-luxury-charcoal/65 hover:bg-luxury-cream dark:text-luxury-alabaster/65 dark:hover:bg-luxury-charcoal'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`text-[9px] px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white text-luxury-gold' : 'bg-luxury-gold/15 text-luxury-gold'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Display Panel */}
        <div className="lg:col-span-9">
          
          {/* TAB 1: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold tracking-wider uppercase border-b border-luxury-gold/10 pb-3 dark:text-white">
                Booking Logs
              </h2>
              
              {bookings.length === 0 ? (
                <div className="bg-white dark:bg-luxury-lightcharcoal rounded-xl border border-luxury-gold/15 p-12 text-center text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 font-light space-y-4">
                  <Calendar size={32} className="mx-auto text-luxury-gold/40" />
                  <p>You haven't made any rental bookings yet.</p>
                  <Link to="/catalog" className="inline-block px-5 py-2.5 bg-luxury-gold text-white font-bold uppercase tracking-widest rounded text-[10px]">
                    Browse Outfits
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map(book => (
                    <div 
                      key={book.id}
                      className="bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div className="flex items-center space-x-4">
                        <img src={book.productImage} alt="" className="w-12 h-16 object-cover rounded bg-luxury-cream" />
                        <div className="text-left space-y-1">
                          <p className="text-[9px] text-luxury-gold font-bold uppercase tracking-widest">{book.storeName}</p>
                          <h3 className="font-bold text-sm dark:text-white">{book.productTitle}</h3>
                          <div className="flex items-center space-x-2 text-[10px] text-luxury-charcoal/50 dark:text-luxury-alabaster/50">
                            <span>Dates: {book.startDate} to {book.endDate}</span>
                            <span>•</span>
                            <span>Size: {book.size}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right info */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-luxury-gold/10 gap-2">
                        <span className={`text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                          book.status === 'Confirmed' 
                            ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' 
                            : book.status === 'Delivered' 
                              ? 'bg-green-500/10 text-green-600 border border-green-500/20' 
                              : 'bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/25'
                        }`}>
                          {book.status}
                        </span>
                        <Link
                          to={`/tracking/${book.id}`}
                          className="text-[10px] uppercase font-bold tracking-widest text-luxury-gold hover:text-luxury-bronze"
                        >
                          Logistics & Returns
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold tracking-wider uppercase border-b border-luxury-gold/10 pb-3 dark:text-white">
                My Bookmarked Couture
              </h2>

              {wishlistItems.length === 0 ? (
                <div className="bg-white dark:bg-luxury-lightcharcoal rounded-xl border border-luxury-gold/15 p-12 text-center text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 font-light space-y-4">
                  <Heart size={32} className="mx-auto text-luxury-gold/40" />
                  <p>Your wishlist is empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {wishlistItems.map(p => (
                    <div 
                      key={p.id}
                      className="bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/10 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between"
                    >
                      <div className="aspect-[3/4] bg-luxury-cream overflow-hidden relative">
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-white/70 text-red-500"
                        >
                          <Trash2 size={12} />
                        </button>
                        <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3.5 space-y-2 text-left">
                        <div>
                          <p className="text-[8px] text-luxury-gold font-bold uppercase tracking-widest">{p.storeName}</p>
                          <h4 className="font-semibold text-xs truncate dark:text-white mt-0.5">{p.title}</h4>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-luxury-gold/10">
                          <span className="text-xs font-bold dark:text-white">₹{p.rentalPricePerDay}/day</span>
                          <Link to={`/product/${p.id}`} className="text-[9px] uppercase font-bold tracking-wider text-luxury-gold">Rent</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-luxury-gold/10 pb-3">
                <h2 className="text-lg font-bold tracking-wider uppercase dark:text-white">
                  Shipping Destinations
                </h2>
                <button
                  onClick={() => setAddressModalOpen(true)}
                  className="text-xs font-semibold text-luxury-gold hover:text-luxury-bronze flex items-center space-x-1"
                >
                  <Plus size={14} /> <span>Add New</span>
                </button>
              </div>

              {/* Saved Address Cards */}
              {user?.addresses && user.addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-4 rounded-xl border border-luxury-gold/15 bg-white dark:bg-luxury-lightcharcoal text-left relative group hover:border-luxury-gold/40 transition-all"
                    >
                      <span className="text-[9px] bg-luxury-gold/20 text-luxury-bronze px-2 py-0.5 rounded font-bold uppercase tracking-wider mb-2 inline-block">
                        {addr.type}
                      </span>
                      <p className="text-xs text-luxury-charcoal/80 dark:text-luxury-alabaster/80 leading-relaxed font-light">{addr.street}</p>
                      <p className="text-xs text-luxury-charcoal/80 dark:text-luxury-alabaster/80 leading-relaxed font-light">{addr.city}, {addr.state} - {addr.zip}</p>

                      <button
                        onClick={() => handleRemoveAddress(addr.id)}
                        className="absolute top-4 right-4 p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-luxury-lightcharcoal rounded-xl border border-luxury-gold/15 p-12 text-center text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 font-light">
                  <MapPin size={32} className="mx-auto text-luxury-gold/40 mb-3" />
                  <p>No shipping addresses saved yet.</p>
                </div>
              )}

              {/* Address Modal Box */}
              {addressModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                  <form onSubmit={handleAddAddress} className="w-full max-w-md bg-white dark:bg-luxury-charcoal border border-luxury-gold/25 p-6 rounded-xl space-y-4 shadow-2xl animate-fade-in-up">
                    <div className="flex items-center justify-between border-b border-luxury-gold/10 pb-3">
                      <h4 className="font-semibold text-sm uppercase text-luxury-gold tracking-widest">New Address Form</h4>
                      <button type="button" onClick={() => setAddressModalOpen(false)} className="text-luxury-charcoal dark:text-white">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="space-y-1 text-left">
                      <span className="text-[9px] uppercase font-bold text-luxury-gold">Type</span>
                      <div className="flex space-x-2">
                        {['Home', 'Office', 'Hotel'].map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setNewType(t)}
                            className={`flex-1 py-1.5 text-xs font-semibold rounded border transition-all ${
                              newType === t ? 'bg-luxury-gold border-luxury-gold text-white' : 'border-luxury-gold/20 dark:text-white'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1 text-left">
                      <span className="text-[9px] uppercase font-bold text-luxury-gold">Flat Details</span>
                      <input
                        type="text"
                        required
                        value={newStreet}
                        onChange={(e) => setNewStreet(e.target.value)}
                        className="w-full p-2 border border-luxury-gold/20 dark:text-white bg-transparent rounded text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1 text-left">
                        <span className="text-[9px] uppercase font-bold text-luxury-gold">City</span>
                        <input
                          type="text"
                          required
                          value={newCity}
                          onChange={(e) => setNewCity(e.target.value)}
                          className="w-full p-2 border border-luxury-gold/20 dark:text-white bg-transparent rounded text-xs"
                        />
                      </div>
                      <div className="space-y-1 text-left">
                        <span className="text-[9px] uppercase font-bold text-luxury-gold">State</span>
                        <input
                          type="text"
                          required
                          value={newState}
                          onChange={(e) => setNewState(e.target.value)}
                          className="w-full p-2 border border-luxury-gold/20 dark:text-white bg-transparent rounded text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 text-left">
                      <span className="text-[9px] uppercase font-bold text-luxury-gold">Pincode</span>
                      <input
                        type="text"
                        required
                        maxLength="6"
                        value={newZip}
                        onChange={(e) => setNewZip(e.target.value)}
                        className="w-full p-2 border border-luxury-gold/20 dark:text-white bg-transparent rounded text-xs"
                      />
                    </div>

                    <button type="submit" className="w-full py-3 bg-luxury-gold text-white text-xs font-bold uppercase rounded">Save</button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DISPUTES */}
          {activeTab === 'disputes' && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-lg font-bold tracking-wider uppercase border-b border-luxury-gold/10 pb-3 dark:text-white">
                Disputes & Security Claims
              </h2>

              {disputeSuccess && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-600 rounded text-xs font-medium">
                  {disputeSuccess}
                </div>
              )}

              {/* List Disputes */}
              {disputes.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-luxury-gold">Dispute Logs</h3>
                  {disputes.map(disp => (
                    <div key={disp.id} className="p-4 rounded-xl border border-luxury-gold/15 bg-white dark:bg-luxury-lightcharcoal text-xs space-y-2">
                      <div className="flex justify-between items-center border-b border-luxury-gold/5 pb-2">
                        <div>
                          <strong className="dark:text-white">{disp.productTitle}</strong>
                          <p className="text-[9px] text-luxury-gold uppercase font-bold tracking-widest">{disp.storeName} • Ref: {disp.bookingId}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                          disp.status === 'Open' ? 'bg-yellow-500/15 text-yellow-600' : 'bg-green-500/15 text-green-600'
                        }`}>
                          {disp.status}
                        </span>
                      </div>
                      <p className="font-light text-luxury-charcoal/70 dark:text-luxury-alabaster/70">
                        <strong>Reason:</strong> {disp.reason}
                      </p>
                      <p className="font-light text-luxury-charcoal/70 dark:text-luxury-alabaster/70">
                        {disp.description}
                      </p>
                      {disp.resolutionNotes && (
                        <div className="mt-2 p-2 bg-luxury-cream/40 rounded border border-luxury-gold/10">
                          <p className="font-bold text-luxury-gold text-[10px]">Claims Desk Resolution:</p>
                          <p className="font-light mt-0.5 text-luxury-charcoal/80 dark:text-luxury-alabaster/80">{disp.resolutionNotes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Dispute File Form */}
              {bookings.length > 0 && (
                <form onSubmit={handleFileDispute} className="bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 p-6 rounded-xl space-y-4 text-xs">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-luxury-gold border-b border-luxury-gold/10 pb-2.5">
                    File a Claims Dispute
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase font-bold text-luxury-gold">1. Select Reservation Order</span>
                      <select
                        required
                        value={selectedBookingId}
                        onChange={(e) => setSelectedBookingId(e.target.value)}
                        className="w-full p-2 bg-transparent border border-luxury-gold/20 dark:text-white rounded"
                      >
                        <option value="">Choose Booking ID</option>
                        {bookings.map(b => (
                          <option key={b.id} value={b.id}>{b.productTitle} ({b.id})</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase font-bold text-luxury-gold">2. Nature of Dispute</span>
                      <select
                        required
                        value={disputeReason}
                        onChange={(e) => setDisputeReason(e.target.value)}
                        className="w-full p-2 bg-transparent border border-luxury-gold/20 dark:text-white rounded"
                      >
                        <option value="">Select Dispute Reason</option>
                        <option value="Deposit Refund Delay">Refund deposit has not arrived (48h elapsed)</option>
                        <option value="Damage Dispute">Disagree with boutique's damage assessment penalty</option>
                        <option value="Sizing Issue">Outfit sizing does not match inputted specifications</option>
                        <option value="Sanitization Issue">Outfit packaging or quality failed clean SLAs</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase font-bold text-luxury-gold">3. Detailed Explanation</span>
                    <textarea
                      required
                      rows="4"
                      value={disputeDescription}
                      onChange={(e) => setDisputeDescription(e.target.value)}
                      placeholder="Please details measurements, timestamps, or reasons to dispute..."
                      className="w-full p-2 bg-transparent border border-luxury-gold/20 dark:text-white rounded"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-luxury-charcoal text-white hover:bg-luxury-gold font-bold uppercase tracking-widest text-[10px] rounded"
                  >
                    File Claim
                  </button>
                </form>
              )}

            </div>
          )}

          {/* TAB 5: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold tracking-wider uppercase border-b border-luxury-gold/10 pb-3 dark:text-white">
                Profile Configuration
              </h2>

              {profileSuccess && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-600 rounded text-xs font-medium">
                  {profileSuccess}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 p-6 rounded-xl space-y-4 max-w-xl text-xs">
                
                <div className="space-y-1 text-left">
                  <span className="text-[9px] uppercase font-bold text-luxury-gold">Email Address (Read-only)</span>
                  <input
                    type="text"
                    disabled
                    value={user?.email || ''}
                    className="w-full p-2 bg-luxury-cream/35 border border-luxury-gold/10 rounded cursor-not-allowed dark:text-white/60"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <span className="text-[9px] uppercase font-bold text-luxury-gold">Display Name</span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 bg-transparent border border-luxury-gold/25 dark:text-white rounded focus:outline-none focus:border-luxury-gold"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <span className="text-[9px] uppercase font-bold text-luxury-gold">Phone Contact</span>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 bg-transparent border border-luxury-gold/25 dark:text-white rounded focus:outline-none focus:border-luxury-gold"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-luxury-gold text-white font-bold uppercase tracking-widest text-[10px] rounded"
                >
                  Save Changes
                </button>

              </form>
            </div>
          )}

        </div>

      </div>
      </>
      )}

    </div>
  );
};

export default CustomerDashboard;
