import React, { useState, useEffect } from 'react';
import { 
  BarChart as ReBarChart, Bar, AreaChart as ReAreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  ShieldCheck, ShieldAlert, Award, RefreshCw, BarChart, Users, ShoppingBag, Shield,
  Package, Trash2, Eye, EyeOff, ClipboardList, CheckCircle
} from 'lucide-react';
import dbService from '../services/db';
import { getAllUsers } from '../services/userProfile';
import SeoHelper from '../components/SeoHelper';

const ORDER_STATUSES = [
  'Confirmed', 'Out for Delivery', 'Delivered', 'Return Pending', 'Cleaning', 'Available Again', 'Cancelled'
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('boutiques'); // 'boutiques' | 'disputes' | 'analytics' | 'listings' | 'bookings'
  const [boutiques, setBoutiques] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [listings, setListings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  
  // Resolution inputs
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [activeDisputeId, setActiveDisputeId] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');

  // Listings search
  const [listingSearch, setListingSearch] = useState('');
  // Bookings search
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('All');

  const loadAdminData = async () => {
    const bouts = await dbService.getBoutiques();
    setBoutiques(bouts);

    const disps = await dbService.getDisputes();
    setDisputes(disps);

    const ords = await dbService.getOrders();
    setBookings(ords);

    const prods = await dbService.getProducts();
    setListings(prods);

    setLoadingCustomers(true);
    const usersList = await getAllUsers();
    setCustomers(usersList);
    setLoadingCustomers(false);
  };

  useEffect(() => {
    loadAdminData();
  }, [activeTab]);

  const handleApproveBoutique = async (id) => {
    const success = await dbService.updateBoutique(id, { verified: true });
    if (success) loadAdminData();
  };

  const handleResolveDispute = async (id, decision) => {
    if (!resolutionNotes) {
      alert("Please enter resolution notes before closing a dispute.");
      return;
    }
    const notes = `Admin Decision: ${decision}. Notes: ${resolutionNotes}`;
    const success = await dbService.resolveDispute(id, "Resolved", notes);
    if (success) {
      setAdminSuccess('✅ Dispute claim resolved successfully. Settlement issued.');
      setResolutionNotes('');
      setActiveDisputeId('');
      loadAdminData();
    }
  };

  const handleToggleListing = async (listing) => {
    const newStatus = listing.active === false ? true : false;
    const success = await dbService.updateProduct(listing.id, { active: newStatus });
    if (success) {
      setAdminSuccess(`${newStatus ? '✅ Listing activated' : '⛔ Listing deactivated'}: ${listing.name || listing.title}`);
      loadAdminData();
    }
  };

  const handleOverrideOrderStatus = async (orderId, newStatus) => {
    const success = await dbService.updateOrder(orderId, { status: newStatus });
    if (success) {
      setAdminSuccess(`✅ Order ${orderId} status overridden to "${newStatus}".`);
      loadAdminData();
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to completely delete ${user.displayName || user.email}? This cannot be undone.`)) return;
    
    try {
      const res = await fetch('/api/deleteUser', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, role: user.role, boutiqueId: user.boutiqueId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user');
      
      setAdminSuccess(`✅ User ${user.email} deleted completely.`);
      loadAdminData();
    } catch (err) {
      alert("Error: " + err.message + "\n(Ensure Vercel serverless functions are running or deployed)");
    }
  };

  // KPIs — derived entirely from real data, no fabricated additions
  const platformGrv = bookings.reduce((acc, b) => acc + (b.rentalCost || 0), 0);
  const activeDisputesCount = disputes.filter(d => d.status === 'Open').length;
  const inactiveListings = listings.filter(l => l.active === false).length;
  const totalRegisteredBoutiques = boutiques.length;

  // Analytics: derive category breakdown from actual bookings
  const categoryCountMap = bookings.reduce((acc, b) => {
    const cat = b.productCategory || 'Other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const bookingsByCategory = Object.entries(categoryCountMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Revenue by month from actual booking data
  const revenueByMonth = bookings.reduce((acc, b) => {
    if (!b.createdAt) return acc;
    const month = new Date(b.createdAt).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + (b.rentalCost || 0);
    return acc;
  }, {});
  const platformGrvData = Object.entries(revenueByMonth).map(([name, grv]) => ({ name, grv }));

  // Filtered listings
  const filteredListings = listings.filter(l => {
    const q = listingSearch.toLowerCase();
    return !q || (l.name || l.title || '').toLowerCase().includes(q);
  });

  // Filtered bookings
  const filteredBookings = bookings.filter(b => {
    const q = bookingSearch.toLowerCase();
    const matchSearch = !q || (b.id || '').toLowerCase().includes(q) || (b.productTitle || '').toLowerCase().includes(q);
    const matchStatus = bookingStatusFilter === 'All' || b.status === bookingStatusFilter;
    return matchSearch && matchStatus;
  });

  const TABS = [
    { id: 'boutiques', label: 'Boutique Onboarding', badge: boutiques.filter(b => !b.verified).length, icon: Award },
    { id: 'disputes', label: 'Dispute Claims', badge: disputes.filter(d => d.status === 'Open').length, icon: ShieldAlert },
    { id: 'listings', label: 'All Listings', badge: inactiveListings > 0 ? inactiveListings : undefined, icon: Package },
    { id: 'bookings', label: 'All Bookings', badge: undefined, icon: ClipboardList },
    { id: 'customers', label: 'Customers', badge: undefined, icon: Users },
    { id: 'analytics', label: 'Analytics', badge: undefined, icon: BarChart },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left animate-fade-in">
      
      <SeoHelper title="Admin Command Center" description="Oversee disputes, onboard partner boutiques, and audit gross marketplace bookings." />

      {/* Header */}
      <div className="border-b border-luxury-gold/20 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-luxury-charcoal dark:text-white font-playfair">Admin Command Center</h1>
          <p className="text-sm font-light text-luxury-charcoal/50 dark:text-luxury-alabaster/50 mt-1">Platform Moderator · Full access mode</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadAdminData}
            className="p-2 border border-luxury-gold/25 rounded-lg text-luxury-gold hover:bg-luxury-gold/10 transition-colors"
            title="Refresh data"
          >
            <RefreshCw size={16} />
          </button>
          <div className="bg-red-600 text-white border border-red-500 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-widest flex items-center">
            <Shield size={14} className="mr-1.5 animate-pulse" /> Security Master Mode
          </div>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 text-xs">
        
        <div className="p-5 bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-bold text-luxury-gold block">Platform GRV</span>
            <span className="text-xl font-bold dark:text-white mt-1 block">₹{platformGrv.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-luxury-gold/10 text-luxury-gold rounded-lg">
            <BarChart size={20} />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-bold text-luxury-gold block">Total Bookings</span>
            <span className="text-xl font-bold dark:text-white mt-1 block">
              {bookings.length > 0 ? bookings.length : '—'}
            </span>
          </div>
          <div className="p-3 bg-luxury-gold/10 text-luxury-gold rounded-lg">
            <ShoppingBag size={20} />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-bold text-luxury-gold block">Boutiques</span>
            <span className="text-xl font-bold dark:text-white mt-1 block">
              {totalRegisteredBoutiques > 0 ? totalRegisteredBoutiques : '—'}
            </span>
          </div>
          <div className="p-3 bg-luxury-gold/10 text-luxury-gold rounded-lg">
            <Users size={20} />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-bold text-luxury-gold block">Open Disputes</span>
            <span className="text-xl font-bold text-red-500 mt-1 block">{activeDisputesCount}</span>
          </div>
          <div className="p-3 bg-red-500/10 text-red-500 rounded-lg">
            <ShieldAlert size={20} />
          </div>
        </div>

      </div>

      {/* Global success banner */}
      {adminSuccess && (
        <div className="mb-6 p-3 bg-green-500/10 border border-green-500/30 text-green-600 rounded text-xs font-semibold flex items-center space-x-2">
          <CheckCircle size={14} />
          <span>{adminSuccess}</span>
          <button onClick={() => setAdminSuccess('')} className="ml-auto text-green-400 hover:text-green-600">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Tabs */}
        <div className="lg:col-span-3 space-y-2 bg-white dark:bg-luxury-lightcharcoal rounded-xl border border-luxury-gold/15 p-4 shadow-sm">
          <p className="text-[9px] uppercase font-bold text-luxury-gold/60 tracking-widest px-2 pb-1">Admin Sections</p>
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                id={`admin-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-left rounded-lg flex items-center justify-between transition-all ${
                  activeTab === tab.id
                    ? 'bg-luxury-gold text-white'
                    : 'text-luxury-charcoal/65 hover:bg-luxury-cream dark:text-luxury-alabaster/65 dark:hover:bg-luxury-charcoal'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon size={12} />
                  {tab.label}
                </span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`text-[9px] px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white text-luxury-gold' : 'bg-luxury-gold/15 text-luxury-gold'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-9">

          {/* ── TAB 1: BOUTIQUE ONBOARDING ── */}
          {activeTab === 'boutiques' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold tracking-wider uppercase border-b border-luxury-gold/10 pb-3 dark:text-white">
                Boutique Verification Queue
              </h2>
              <div className="space-y-4">
                {boutiques.length === 0 && (
                  <div className="bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 rounded-xl p-12 text-center text-xs text-luxury-charcoal/50">
                    No boutiques registered yet.
                  </div>
                )}
                {boutiques.map(boutique => (
                  <div key={boutique.id} className="p-5 border border-luxury-gold/15 bg-white dark:bg-luxury-lightcharcoal rounded-xl text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                    <div className="flex items-center space-x-4">
                      <img src={boutique.logo} alt="" className="w-12 h-12 rounded-full object-cover border border-luxury-gold bg-white flex-shrink-0" />
                      <div className="text-left space-y-1">
                        <h4 className="font-bold text-sm dark:text-white">{boutique.name}</h4>
                        <p className="text-[10px] text-luxury-gold font-bold uppercase tracking-widest">{boutique.location} · Joined: {boutique.joinedDate}</p>
                        <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 font-light line-clamp-2">{boutique.description}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {boutique.verified ? (
                        <span className="inline-flex items-center px-3 py-1 bg-green-500/10 text-green-600 rounded-full font-semibold uppercase tracking-wider text-[9px] border border-green-500/20">
                          <ShieldCheck size={12} className="mr-1" /> Approved
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApproveBoutique(boutique.id)}
                          className="px-4 py-2 bg-luxury-gold text-white hover:bg-luxury-bronze rounded text-[10px] font-bold uppercase tracking-widest transition-all"
                        >
                          Approve Store
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 2: DISPUTE CLAIMS ── */}
          {activeTab === 'disputes' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold tracking-wider uppercase border-b border-luxury-gold/10 pb-3 dark:text-white">
                Platform Dispute & Claims Desk
              </h2>
              {disputes.length === 0 ? (
                <div className="bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 rounded-xl p-12 text-center text-xs text-luxury-charcoal/50">
                  Zero active platform dispute cases currently open. All security deposits verified and refunded.
                </div>
              ) : (
                <div className="space-y-4">
                  {disputes.map(disp => (
                    <div key={disp.id} className="p-5 border border-luxury-gold/15 bg-white dark:bg-luxury-lightcharcoal rounded-xl text-xs space-y-4 shadow-sm text-left">
                      <div className="flex justify-between items-start border-b border-luxury-gold/5 pb-2">
                        <div>
                          <strong className="font-bold text-sm dark:text-white">{disp.productTitle}</strong>
                          <p className="text-[9px] text-luxury-gold uppercase font-bold tracking-widest mt-0.5">Order Ref: {disp.bookingId} · Boutique: {disp.storeName} · Client: {disp.userName}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                          disp.status === 'Open' ? 'bg-yellow-500/15 text-yellow-600' : 'bg-green-500/15 text-green-600'
                        }`}>
                          {disp.status}
                        </span>
                      </div>
                      <div className="space-y-1 bg-luxury-cream/15 p-3.5 rounded border border-luxury-gold/10 leading-relaxed font-light">
                        <p className="font-semibold text-luxury-gold text-[10px]">Nature of Claim:</p>
                        <p>{disp.reason} - {disp.description}</p>
                        {disp.damageFeeRequested && <p className="font-bold text-red-500 mt-2">Boutique Penalty Request: ₹{disp.damageFeeRequested.toLocaleString()}</p>}
                      </div>
                      {disp.status === 'Open' ? (
                        <div className="space-y-3 pt-3 border-t border-luxury-gold/5">
                          {activeDisputeId === disp.id ? (
                            <div className="space-y-3">
                              <span className="text-[9px] uppercase font-bold text-luxury-gold block">Log Settlement Verdict</span>
                              <textarea
                                rows="3"
                                value={resolutionNotes}
                                onChange={(e) => setResolutionNotes(e.target.value)}
                                placeholder="Explain resolution verdict (e.g. Approve penalty ₹1000, refund rest ₹4000 to customer...)"
                                className="w-full p-2 bg-transparent border border-luxury-gold/20 dark:text-white rounded text-xs"
                              />
                              <div className="flex space-x-2 flex-wrap gap-y-2">
                                <button onClick={() => handleResolveDispute(disp.id, "Penalty Approved")} className="px-4 py-2 bg-red-600 text-white rounded font-bold uppercase tracking-widest text-[9px]">
                                  Approve Boutique Claim
                                </button>
                                <button onClick={() => handleResolveDispute(disp.id, "Refund Client")} className="px-4 py-2 bg-green-600 text-white rounded font-bold uppercase tracking-widest text-[9px]">
                                  Refund Client In Full
                                </button>
                                <button onClick={() => setActiveDisputeId('')} className="px-4 py-2 border border-luxury-gold/30 text-luxury-gold rounded font-bold uppercase tracking-widest text-[9px]">
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => { setActiveDisputeId(disp.id); setResolutionNotes(''); }}
                              className="px-4 py-2 bg-luxury-charcoal text-white hover:bg-luxury-gold rounded font-bold uppercase tracking-widest text-[9px]"
                            >
                              Issue Verdict / Resolve Claim
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-600 rounded leading-relaxed">
                          <p className="font-bold text-[9px] uppercase">Case Settled & Closed</p>
                          <p className="font-light mt-0.5">{disp.resolutionNotes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB 3: MASTER LISTINGS MANAGER ── */}
          {activeTab === 'listings' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-luxury-gold/10 pb-3">
                <h2 className="text-lg font-bold tracking-wider uppercase dark:text-white">Master Listings Manager</h2>
                <div className="flex items-center gap-2 text-[10px] text-luxury-charcoal/50 dark:text-luxury-alabaster/50">
                  <Package size={12} />
                  <span>{listings.length} total listings · {inactiveListings} deactivated</span>
                </div>
              </div>

              {/* Search */}
              <input
                type="text"
                placeholder="Search listings by name..."
                value={listingSearch}
                onChange={(e) => setListingSearch(e.target.value)}
                className="w-full px-4 py-2.5 border border-luxury-gold/25 bg-transparent dark:text-white rounded text-xs focus:outline-none focus:border-luxury-gold"
              />

              <div className="space-y-3">
                {filteredListings.length === 0 && (
                  <div className="bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 rounded-xl p-10 text-center text-xs text-luxury-charcoal/50">
                    No listings found.
                  </div>
                )}
                {filteredListings.map(listing => {
                  const isActive = listing.active !== false;
                  return (
                    <div
                      key={listing.id}
                      className={`p-4 border rounded-xl text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-sm transition-all ${
                        isActive
                          ? 'bg-white dark:bg-luxury-lightcharcoal border-luxury-gold/15'
                          : 'bg-red-50/50 dark:bg-red-900/10 border-red-300/30 opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={listing.images?.[0] || listing.image || 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=80&h=80&q=80'}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover border border-luxury-gold/20 flex-shrink-0"
                        />
                        <div>
                          <p className="font-bold dark:text-white">{listing.name || listing.title || `Listing ${listing.id}`}</p>
                          <p className="text-luxury-gold text-[9px] font-semibold uppercase tracking-wider mt-0.5">
                            {listing.category} · ₹{(listing.rentalPrice || listing.price || 0).toLocaleString()}/day · {listing.boutiqueName || 'Unknown Boutique'}
                          </p>
                          <p className="text-[9px] text-luxury-charcoal/40 dark:text-luxury-alabaster/40 mt-0.5">ID: {listing.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-[9px] px-2 py-1 rounded-full font-bold uppercase ${
                          isActive ? 'bg-green-500/15 text-green-600' : 'bg-red-500/15 text-red-600'
                        }`}>
                          {isActive ? '● Active' : '● Inactive'}
                        </span>
                        <button
                          onClick={() => handleToggleListing(listing)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-bold uppercase tracking-wider text-[9px] transition-colors ${
                            isActive
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {isActive ? <><EyeOff size={11} /> Deactivate</> : <><Eye size={11} /> Re-activate</>}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── TAB 4: MASTER BOOKINGS MANAGER ── */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-luxury-gold/10 pb-3">
                <h2 className="text-lg font-bold tracking-wider uppercase dark:text-white">Master Bookings Manager</h2>
                <div className="flex items-center gap-2 text-[10px] text-luxury-charcoal/50 dark:text-luxury-alabaster/50">
                  <ClipboardList size={12} />
                  <span>{bookings.length} total bookings</span>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Search by order ID or outfit name..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-luxury-gold/25 bg-transparent dark:text-white rounded text-xs focus:outline-none focus:border-luxury-gold"
                />
                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  className="px-3 py-2.5 border border-luxury-gold/25 bg-white dark:bg-luxury-lightcharcoal dark:text-white rounded text-xs focus:outline-none focus:border-luxury-gold"
                >
                  <option value="All">All Statuses</option>
                  {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {bookings.length === 0 ? (
                <div className="bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 rounded-xl p-12 text-center text-xs text-luxury-charcoal/50">
                  No bookings on the platform yet. They will appear once customers checkout.
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 rounded-xl p-10 text-center text-xs text-luxury-charcoal/50">
                  No bookings match your filters.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBookings.map(booking => (
                    <div key={booking.id} className="p-5 border border-luxury-gold/15 bg-white dark:bg-luxury-lightcharcoal rounded-xl text-xs space-y-3 shadow-sm">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <p className="font-bold dark:text-white text-sm">{booking.productTitle || 'Outfit Booking'}</p>
                          <p className="text-[9px] text-luxury-gold uppercase font-semibold tracking-wider mt-0.5">
                            ID: {booking.id} · ₹{(booking.rentalCost || 0).toLocaleString()} · {booking.startDate} → {booking.endDate}
                          </p>
                          {booking.userName && (
                            <p className="text-[9px] text-luxury-charcoal/50 dark:text-luxury-alabaster/50 mt-0.5">
                              Customer: {booking.userName} · Boutique: {booking.storeName}
                            </p>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase flex-shrink-0 ${
                          booking.status === 'Confirmed' ? 'bg-blue-500/15 text-blue-600' :
                          booking.status === 'Delivered' ? 'bg-green-500/15 text-green-600' :
                          booking.status === 'Cancelled' ? 'bg-red-500/15 text-red-600' :
                          booking.status === 'Available Again' ? 'bg-emerald-500/15 text-emerald-600' :
                          'bg-amber-500/15 text-amber-600'
                        }`}>
                          {booking.status}
                        </span>
                      </div>

                      {/* Admin Status Override */}
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-luxury-gold/10 items-center">
                        <span className="text-[9px] uppercase font-bold text-luxury-gold mr-1">Override Status →</span>
                        {ORDER_STATUSES.filter(s => s !== booking.status).map(s => (
                          <button
                            key={s}
                            onClick={() => handleOverrideOrderStatus(booking.id, s)}
                            className="px-2 py-1 bg-luxury-charcoal/10 dark:bg-luxury-alabaster/10 hover:bg-luxury-gold hover:text-white text-luxury-charcoal dark:text-luxury-alabaster rounded text-[8px] font-bold uppercase tracking-wider transition-colors"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB 5: ANALYTICS ── */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold tracking-wider uppercase border-b border-luxury-gold/10 pb-3 dark:text-white">
                Platform Analytics
              </h2>

              {bookings.length === 0 ? (
                <div className="bg-white dark:bg-luxury-lightcharcoal border border-dashed border-luxury-gold/20 rounded-xl p-16 text-center space-y-3">
                  <BarChart size={32} className="mx-auto text-luxury-gold/30" />
                  <p className="text-sm font-semibold dark:text-white">No booking data yet</p>
                  <p className="text-xs text-luxury-charcoal/40 dark:text-luxury-alabaster/40">
                    Analytics charts will populate automatically as customers place orders.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 p-6 rounded-xl shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-luxury-gold mb-4">Gross Rental Volume (GRV) by Month</h3>
                    {platformGrvData.length > 0 ? (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <ReAreaChart data={platformGrvData}>
                            <defs>
                              <linearGradient id="colorGrv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#C5A880" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#C5A880" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#C5A880" fontSize={10} />
                            <YAxis stroke="#C5A880" fontSize={10} />
                            <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, 'GRV']} />
                            <Area type="monotone" dataKey="grv" stroke="#C5A880" fillOpacity={1} fill="url(#colorGrv)" />
                          </ReAreaChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <p className="text-xs text-center text-luxury-charcoal/40 py-10">No revenue data yet.</p>
                    )}
                  </div>

                  <div className="bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 p-6 rounded-xl shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-luxury-gold mb-4">Bookings by Category</h3>
                    {bookingsByCategory.length > 0 ? (
                      <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <ReBarChart data={bookingsByCategory} barSize={32}>
                            <XAxis dataKey="name" stroke="#C5A880" fontSize={10} />
                            <YAxis stroke="#C5A880" fontSize={10} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#C5A880" radius={[4, 4, 0, 0]} />
                          </ReBarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <p className="text-xs text-center text-luxury-charcoal/40 py-10">No category data yet.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* CUSTOMERS TAB */}
          {activeTab === 'customers' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold dark:text-white flex items-center">
                  <Users className="text-luxury-gold mr-3" size={24} />
                  Platform Users
                </h2>
                <div className="text-xs font-semibold px-3 py-1 bg-luxury-gold/10 text-luxury-gold rounded-full">
                  {customers.length} Total
                </div>
              </div>

              {loadingCustomers ? (
                <div className="text-sm font-light text-luxury-charcoal/60 dark:text-luxury-alabaster/60 text-center py-8">
                  Loading users...
                </div>
              ) : customers.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-luxury-charcoal rounded-xl border border-luxury-gold/15">
                  <Users size={40} className="mx-auto text-luxury-gold/40 mb-3" />
                  <p className="text-sm font-medium dark:text-white">No users found</p>
                </div>
              ) : (
                <div className="bg-white dark:bg-luxury-charcoal border border-luxury-gold/15 rounded-xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-luxury-cream dark:bg-luxury-lightcharcoal border-b border-luxury-gold/15">
                        <tr>
                          <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-luxury-gold">User</th>
                          <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-luxury-gold">Email</th>
                          <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-luxury-gold">Role</th>
                          <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-luxury-gold">Joined Date</th>
                          <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-luxury-gold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-luxury-gold/10">
                        {customers.map((user) => (
                          <tr key={user.uid} className="hover:bg-luxury-gold/5 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-semibold dark:text-white">{user.displayName || 'Unknown'}</div>
                              <div className="text-[10px] text-luxury-charcoal/50 dark:text-luxury-alabaster/50 mt-0.5">UID: {user.uid}</div>
                            </td>
                            <td className="px-6 py-4 font-light dark:text-white">
                              {user.email}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${
                                user.role === 'admin' ? 'bg-red-500/10 text-red-500' :
                                user.role === 'store' ? 'bg-luxury-gold/10 text-luxury-gold' :
                                'bg-green-500/10 text-green-500'
                              }`}>
                                {user.role || 'customer'}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-light text-luxury-charcoal/70 dark:text-luxury-alabaster/70">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {user.role !== 'admin' && (
                                <button 
                                  onClick={() => handleDeleteUser(user)}
                                  className="text-luxury-charcoal/40 hover:text-red-500 transition-colors"
                                  title="Delete User"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
