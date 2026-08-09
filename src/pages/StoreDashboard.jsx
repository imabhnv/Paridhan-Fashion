import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart as ReBarChart, Bar, LineChart as ReLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Sparkles, DollarSign, ShoppingBag, RefreshCw, AlertCircle, Plus, Calendar, Settings, Image, CheckCircle, Tag, BarChart2 
} from 'lucide-react';
import dbService from '../services/db';
import SeoHelper from '../components/SeoHelper';

const StoreDashboard = () => {
  const { user } = useAuth();
  
  // Dashboard states
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'listings' | 'new-listing' | 'bookings' | 'damages'
  const [products, setProducts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [disputes, setDisputes] = useState([]);

  // Listing creation form state
  const [title, setTitle] = useState('');
  const [gender, setGender] = useState('Women');
  const [category, setCategory] = useState('Designer Lehengas');
  const [imageUrl, setImageUrl] = useState('');
  const [rentalPrice, setRentalPrice] = useState('');
  const [retailPrice, setRetailPrice] = useState('');
  const [deposit, setDeposit] = useState('');
  const [selectedSizes, setSelectedSizes] = useState(['S', 'M']);
  const [color, setColor] = useState('');
  const [fabric, setFabric] = useState('');
  const [occasion, setOccasion] = useState('Wedding');
  const [stylistNotes, setStylistNotes] = useState('');
  const [desc, setDesc] = useState('');
  const [listingSuccess, setListingSuccess] = useState('');

  // Damage filing state
  const [damageBookingId, setDamageBookingId] = useState('');
  const [damageDesc, setDamageDesc] = useState('');
  const [damageFee, setDamageFee] = useState('');
  const [damageSuccess, setDamageSuccess] = useState('');

  const loadBoutiqueData = async () => {
    if (!user) return;
    
    // Load products matching this boutique
    const allProds = await dbService.getProducts();
    const boutiqueProds = allProds.filter(p => p.storeId === user.boutiqueId);
    setProducts(boutiqueProds);

    // Load bookings matching storeId
    const allOrders = await dbService.getOrders({ storeId: user.boutiqueId });
    setBookings(allOrders);

    // Load disputes
    const allDisps = await dbService.getDisputes();
    const storeDisps = allDisps.filter(d => d.storeId === user.boutiqueId);
    setDisputes(storeDisps);
  };

  useEffect(() => {
    loadBoutiqueData();
  }, [user, activeTab]);

  const handleCreateListing = async (e) => {
    e.preventDefault();
    setListingSuccess('');

    // Pre-fill image if empty
    const imgPath = imageUrl.trim() || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&h=800&q=80";

    const newProduct = {
      title,
      category,
      gender,
      images: [imgPath],
      rentalPricePerDay: Number(rentalPrice),
      originalRetailPrice: Number(retailPrice),
      securityDeposit: Number(deposit),
      storeId: user.boutiqueId,
      storeName: user.displayName,
      rating: 5.0,
      reviewsCount: 0,
      sizes: selectedSizes,
      colors: [color],
      fabric,
      occasion,
      description: desc,
      availability: true,
      bookedDates: [],
      cleanlinessRating: 5.0,
      stylistNotes,
      verified: true
    };

    await dbService.addProduct(newProduct);
    setListingSuccess('🎉 Luxury Listing added to live catalog successfully!');
    
    // Reset Form
    setTitle('');
    setImageUrl('');
    setRentalPrice('');
    setRetailPrice('');
    setDeposit('');
    setColor('');
    setFabric('');
    setStylistNotes('');
    setDesc('');
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    await dbService.updateOrder(orderId, { status: newStatus });
    loadBoutiqueData();
  };

  const handleReportDamage = async (e) => {
    e.preventDefault();
    if (!damageBookingId || !damageFee) return;

    const matchedBooking = bookings.find(b => b.id === damageBookingId);

    const disputeData = {
      userId: matchedBooking.userId,
      userName: matchedBooking.customerName,
      userEmail: matchedBooking.customerEmail,
      bookingId: damageBookingId,
      productTitle: matchedBooking.productTitle,
      storeId: user.boutiqueId,
      storeName: user.displayName,
      reason: "Boutique Filed Damage Claim",
      description: `Store reported damage: ${damageDesc}. Deducting penalty of ₹${damageFee} from client's security deposit.`,
      damageFeeRequested: Number(damageFee),
      status: "Open"
    };

    await dbService.fileDispute(disputeData);
    setDamageSuccess('⚠️ Damage dispute reported to admin claims auditor.');
    setDamageBookingId('');
    setDamageDesc('');
    setDamageFee('');
    loadBoutiqueData();
  };

  // Sizing Checkbox toggle helper
  const handleSizeToggle = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  // KPIs — all derived from real booking data, no fabricated additions
  const totalBoutiqueRentals = bookings.length;
  const activeRentals = bookings.filter(b => ['Confirmed', 'Out for Delivery', 'Delivered'].includes(b.status)).length;
  const pendingReturns = bookings.filter(b => b.status === 'Return Pending').length;
  const grossBoutiqueEarnings = bookings.reduce((acc, b) => acc + (b.rentalCost || 0), 0);

  // Revenue by month — derived from actual bookings
  const revenueByMonth = bookings.reduce((acc, b) => {
    if (!b.createdAt) return acc;
    const month = new Date(b.createdAt).toLocaleString('default', { month: 'short' });
    acc[month] = { revenue: (acc[month]?.revenue || 0) + (b.rentalCost || 0), rentals: (acc[month]?.rentals || 0) + 1 };
    return acc;
  }, {});
  const revenueData = Object.entries(revenueByMonth).map(([name, vals]) => ({ name, ...vals }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left animate-fade-in">
      
      <SeoHelper title="Showroom Portal" description="Manage listings, analyze monthly earnings, and verify return inspections." />

      <div className="border-b border-luxury-gold/20 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-luxury-charcoal dark:text-white">Boutique Console</h1>
          <p className="text-sm font-light text-luxury-charcoal/50 dark:text-luxury-alabaster/50 mt-1">
            Store Owner: <strong className="font-semibold text-luxury-gold">{user?.displayName}</strong>
          </p>
        </div>
        <div className="bg-luxury-charcoal dark:bg-white text-white dark:text-luxury-charcoal border border-luxury-gold/20 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-widest flex items-center">
          <Settings size={14} className="mr-1.5" /> Boutique Mode
        </div>
      </div>

      {/* KPI METRICS BAR */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        <div className="p-5 bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-bold text-luxury-gold block">Gross Earnings</span>
            <span className="text-xl font-bold dark:text-white mt-1 block">₹{grossBoutiqueEarnings.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-luxury-gold/10 text-luxury-gold rounded-lg">
            <DollarSign size={20} />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-bold text-luxury-gold block">Total Rentals</span>
            <span className="text-xl font-bold dark:text-white mt-1 block">{totalBoutiqueRentals} orders</span>
          </div>
          <div className="p-3 bg-luxury-gold/10 text-luxury-gold rounded-lg">
            <ShoppingBag size={20} />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-bold text-luxury-gold block">Active Rentals</span>
            <span className="text-xl font-bold dark:text-white mt-1 block">{activeRentals} outfits</span>
          </div>
          <div className="p-3 bg-luxury-gold/10 text-luxury-gold rounded-lg">
            <Calendar size={20} />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-bold text-luxury-gold block">Pending Returns</span>
            <span className="text-xl font-bold text-red-500 mt-1 block">{pendingReturns} returns</span>
          </div>
          <div className="p-3 bg-red-500/10 text-red-500 rounded-lg animate-pulse">
            <RefreshCw size={20} />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Tabs */}
        <div className="lg:col-span-3 space-y-2 bg-white dark:bg-luxury-lightcharcoal rounded-xl border border-luxury-gold/15 p-5 shadow-sm">
          {[
            { id: 'analytics', label: 'Store Analytics' },
            { id: 'listings', label: 'My Listings', badge: products.length },
            { id: 'new-listing', label: 'Add Luxury Outfit' },
            { id: 'bookings', label: 'Rental Bookings', badge: bookings.length },
            { id: 'damages', label: 'File Damage Claim', badge: disputes.length }
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
          
          {/* TAB 1: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <h2 className="text-lg font-bold tracking-wider uppercase border-b border-luxury-gold/10 pb-3 dark:text-white">
                Revenue &amp; Rent Trends
              </h2>

              {bookings.length === 0 ? (
                <div className="bg-white dark:bg-luxury-lightcharcoal border border-dashed border-luxury-gold/20 rounded-xl p-16 text-center space-y-3">
                  <BarChart2 size={32} className="mx-auto text-luxury-gold/30" />
                  <p className="text-sm font-semibold dark:text-white">No booking data yet</p>
                  <p className="text-xs text-luxury-charcoal/50 dark:text-luxury-alabaster/50">
                    Analytics will populate automatically once customers book your outfits.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 p-5 rounded-xl shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-luxury-gold mb-4">Monthly Earnings (₹)</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReLineChart data={revenueData}>
                          <XAxis dataKey="name" stroke="#C5A880" fontSize={10} />
                          <YAxis stroke="#C5A880" fontSize={10} />
                          <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, 'Revenue']} />
                          <Line type="monotone" dataKey="revenue" stroke="#C5A880" strokeWidth={2.5} activeDot={{ r: 6 }} />
                        </ReLineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 p-5 rounded-xl shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-luxury-gold mb-4">Rentals per Month</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReBarChart data={revenueData}>
                          <XAxis dataKey="name" stroke="#C5A880" fontSize={10} />
                          <YAxis stroke="#C5A880" fontSize={10} />
                          <Tooltip />
                          <Bar dataKey="rentals" fill="#111111" radius={[4, 4, 0, 0]} />
                        </ReBarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LISTINGS (Manage current active list) */}
          {activeTab === 'listings' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold tracking-wider uppercase border-b border-luxury-gold/10 pb-3 dark:text-white">
                My Outfit Inventory
              </h2>
              
              {products.length === 0 ? (
                <div className="bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 rounded-xl p-12 text-center text-xs font-light text-luxury-charcoal/50">
                  No active listings yet. Add a new design to start generating rental revenue.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {products.map(p => (
                    <div key={p.id} className="p-4 border border-luxury-gold/15 bg-white dark:bg-luxury-lightcharcoal rounded-xl flex items-center space-x-4">
                      <img src={p.images[0]} alt="" className="w-14 h-20 object-cover rounded bg-luxury-cream flex-shrink-0" />
                      <div className="text-left min-w-0 flex-1">
                        <h4 className="font-bold text-sm truncate dark:text-white">{p.title}</h4>
                        <p className="text-[10px] text-luxury-gold font-bold uppercase tracking-widest mt-0.5">{p.category}</p>
                        <div className="flex items-center justify-between pt-2 mt-2 border-t border-luxury-gold/10 text-xs">
                          <span className="font-bold dark:text-white">₹{p.rentalPricePerDay}/day</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${p.availability ? 'bg-green-500/10 text-green-600' : 'bg-red-500/15 text-red-600'}`}>
                            {p.availability ? 'Active' : 'Booked'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: NEW LISTING FORM */}
          {activeTab === 'new-listing' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold tracking-wider uppercase border-b border-luxury-gold/10 pb-3 dark:text-white">
                Register New Luxury Design
              </h2>

              {listingSuccess && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-600 rounded text-xs font-medium">
                  {listingSuccess}
                </div>
              )}

              <form onSubmit={handleCreateListing} className="bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 p-6 rounded-xl space-y-4 text-xs font-light text-luxury-charcoal/70 dark:text-luxury-alabaster/70">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <span className="text-[9px] uppercase font-bold text-luxury-gold">Outfit Design Title</span>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Gold Sequined Bridal Lehenga"
                      className="w-full p-2 bg-transparent border border-luxury-gold/20 dark:text-white rounded"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <span className="text-[9px] uppercase font-bold text-luxury-gold">Category Silhouette</span>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2 bg-transparent border border-luxury-gold/20 dark:text-white rounded"
                    >
                      <option value="Designer Lehengas">Designer Lehengas</option>
                      <option value="Tuxedos">Tuxedos</option>
                      <option value="Bridal Wear">Bridal Wear</option>
                      <option value="Ethnic Wear">Ethnic Wear</option>
                      <option value="Party Wear">Party Wear</option>
                      <option value="Luxury Gowns">Luxury Gowns</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5 text-left">
                    <span className="text-[9px] uppercase font-bold text-luxury-gold">Gender Selection</span>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full p-2 bg-transparent border border-luxury-gold/20 dark:text-white rounded"
                    >
                      <option value="Women">Women</option>
                      <option value="Men">Men</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <span className="text-[9px] uppercase font-bold text-luxury-gold">Occasion Type</span>
                    <select
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      className="w-full p-2 bg-transparent border border-luxury-gold/20 dark:text-white rounded"
                    >
                      <option value="Wedding">Wedding</option>
                      <option value="Reception">Reception</option>
                      <option value="Sangeet / Mehendi">Sangeet / Mehendi</option>
                      <option value="Festival">Festival</option>
                      <option value="Farewell">College Farewell</option>
                      <option value="Party / Cocktail">Party / Cocktail</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <span className="text-[9px] uppercase font-bold text-luxury-gold">Color Shade</span>
                    <input
                      type="text"
                      required
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="Gold & Ivory"
                      className="w-full p-2 bg-transparent border border-luxury-gold/20 dark:text-white rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5 text-left">
                    <span className="text-[9px] uppercase font-bold text-luxury-gold">Rental Price / Day (INR)</span>
                    <input
                      type="number"
                      required
                      value={rentalPrice}
                      onChange={(e) => setRentalPrice(e.target.value)}
                      placeholder="3500"
                      className="w-full p-2 bg-transparent border border-luxury-gold/20 dark:text-white rounded"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <span className="text-[9px] uppercase font-bold text-luxury-gold">Original Retail Price (INR)</span>
                    <input
                      type="number"
                      required
                      value={retailPrice}
                      onChange={(e) => setRetailPrice(e.target.value)}
                      placeholder="120000"
                      className="w-full p-2 bg-transparent border border-luxury-gold/20 dark:text-white rounded"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <span className="text-[9px] uppercase font-bold text-luxury-gold">Refundable Deposit (INR)</span>
                    <input
                      type="number"
                      required
                      value={deposit}
                      onChange={(e) => setDeposit(e.target.value)}
                      placeholder="5000"
                      className="w-full p-2 bg-transparent border border-luxury-gold/20 dark:text-white rounded"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <span className="text-[9px] uppercase font-bold text-luxury-gold">Fabric & Handwork Craft Details</span>
                  <input
                    type="text"
                    required
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    placeholder="Raw silk with heavy zardozi sequined embroideries"
                    className="w-full p-2 bg-transparent border border-luxury-gold/20 dark:text-white rounded"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <span className="text-[9px] uppercase font-bold text-luxury-gold">Stylist Fit Suggestion Notes</span>
                  <input
                    type="text"
                    required
                    value={stylistNotes}
                    onChange={(e) => setStylistNotes(e.target.value)}
                    placeholder="Style with classic kundan set and high heels"
                    className="w-full p-2 bg-transparent border border-luxury-gold/20 dark:text-white rounded"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <span className="text-[9px] uppercase font-bold text-luxury-gold">Main Image URL (or mockup placeholder)</span>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full p-2 bg-transparent border border-luxury-gold/20 dark:text-white rounded"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <span className="text-[9px] uppercase font-bold text-luxury-gold">Sizes Available</span>
                  <div className="flex space-x-4 pt-1">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => (
                      <label key={s} className="flex items-center space-x-1.5 select-none cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(s)}
                          onChange={() => handleSizeToggle(s)}
                          className="w-4 h-4 text-luxury-gold focus:ring-luxury-gold rounded accent-luxury-gold"
                        />
                        <span className="dark:text-white font-medium">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <span className="text-[9px] uppercase font-bold text-luxury-gold">Full Narrative Description</span>
                  <textarea
                    rows="3"
                    required
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full p-2 bg-transparent border border-luxury-gold/20 dark:text-white rounded"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 bg-luxury-gold text-white font-bold uppercase tracking-widest text-[10px] rounded hover:bg-luxury-bronze"
                >
                  Publish Luxury Design
                </button>

              </form>
            </div>
          )}

          {/* TAB 4: BOOKINGS (Logistics workflow steps) */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold tracking-wider uppercase border-b border-luxury-gold/10 pb-3 dark:text-white">
                Client Reservation Orders
              </h2>

              {bookings.length === 0 ? (
                <div className="bg-white dark:bg-luxury-lightcharcoal rounded-xl border border-luxury-gold/15 p-12 text-center text-xs font-light text-luxury-charcoal/50">
                  No orders booked by clients yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map(book => (
                    <div key={book.id} className="p-5 border border-luxury-gold/15 bg-white dark:bg-luxury-lightcharcoal rounded-xl text-xs space-y-4 shadow-sm">
                      <div className="flex justify-between items-start border-b border-luxury-gold/5 pb-2">
                        <div>
                          <strong className="font-bold text-sm dark:text-white">{book.productTitle}</strong>
                          <p className="text-[9px] text-luxury-gold uppercase font-bold tracking-widest mt-0.5">Order Ref: {book.id} • User: {book.customerName}</p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                          book.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-600' : 'bg-luxury-gold/10 text-luxury-gold'
                        }`}>
                          {book.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left font-light text-luxury-charcoal/60 dark:text-luxury-alabaster/60 leading-relaxed">
                        <div>
                          <span className="font-semibold text-luxury-gold text-[9px] uppercase block">Dates</span>
                          {book.startDate} to {book.endDate}
                        </div>
                        <div>
                          <span className="font-semibold text-luxury-gold text-[9px] uppercase block">Size fit</span>
                          {book.size} (S-{book.sizingMeasurements?.shoulder}" C-{book.sizingMeasurements?.chest}" W-{book.sizingMeasurements?.waist}")
                        </div>
                        <div>
                          <span className="font-semibold text-luxury-gold text-[9px] uppercase block">Earnings</span>
                          ₹{book.rentalCost?.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-semibold text-luxury-gold text-[9px] uppercase block">Refundable Dep.</span>
                          ₹{book.securityDeposit?.toLocaleString()}
                        </div>
                      </div>

                      {/* Logistics flow controls */}
                      <div className="pt-3 border-t border-luxury-gold/5 flex flex-wrap gap-2 items-center justify-between">
                        <span className="text-[10px] text-luxury-gold font-bold uppercase tracking-wider">Logistics SLA Updates:</span>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleUpdateStatus(book.id, 'Out for Delivery')}
                            className="px-3 py-1.5 bg-luxury-charcoal text-white hover:bg-luxury-gold rounded text-[9px] font-bold uppercase transition-all"
                          >
                            Out for Del.
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(book.id, 'Delivered')}
                            className="px-3 py-1.5 bg-luxury-charcoal text-white hover:bg-luxury-gold rounded text-[9px] font-bold uppercase transition-all"
                          >
                            Delivered
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(book.id, 'Cleaning')}
                            className="px-3 py-1.5 bg-luxury-charcoal text-white hover:bg-luxury-gold rounded text-[9px] font-bold uppercase transition-all"
                          >
                            Send to Clean
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(book.id, 'Available Again')}
                            className="px-3 py-1.5 bg-green-600 text-white rounded text-[9px] font-bold uppercase transition-all"
                          >
                            Clean & Restock
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: DAMAGE REPORT SYSTEM */}
          {activeTab === 'damages' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold tracking-wider uppercase border-b border-luxury-gold/10 pb-3 dark:text-white">
                Damage Protection Reports
              </h2>

              {damageSuccess && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-xs font-semibold">
                  {damageSuccess}
                </div>
              )}

              {disputes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-luxury-gold">Active Claims Logs</h3>
                  {disputes.map(disp => (
                    <div key={disp.id} className="p-4 border border-luxury-gold/15 bg-white dark:bg-luxury-lightcharcoal rounded-xl text-xs space-y-2 text-left">
                      <div className="flex justify-between items-center pb-2 border-b border-luxury-gold/5">
                        <div>
                          <strong className="font-bold dark:text-white">{disp.productTitle}</strong>
                          <p className="text-[9px] text-luxury-gold font-bold uppercase tracking-widest mt-0.5">User: {disp.userName} • Order: {disp.bookingId}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                          disp.status === 'Open' ? 'bg-yellow-500/15 text-yellow-600' : 'bg-green-500/15 text-green-600'
                        }`}>
                          {disp.status}
                        </span>
                      </div>
                      <p className="font-light text-luxury-charcoal/70 dark:text-luxury-alabaster/70">{disp.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Form to submit Damage Report */}
              {bookings.length > 0 && (
                <form onSubmit={handleReportDamage} className="bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 p-6 rounded-xl space-y-4 text-xs font-light">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-luxury-gold border-b border-luxury-gold/10 pb-2.5">
                    Log Damage Inspection Penalty
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <span className="text-[9px] uppercase font-bold text-luxury-gold">1. Select Damaged Booking Order</span>
                      <select
                        required
                        value={damageBookingId}
                        onChange={(e) => setDamageBookingId(e.target.value)}
                        className="w-full p-2 bg-transparent border border-luxury-gold/20 dark:text-white rounded"
                      >
                        <option value="">Choose Booking</option>
                        {bookings.map(b => (
                          <option key={b.id} value={b.id}>{b.productTitle} ({b.id})</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <span className="text-[9px] uppercase font-bold text-luxury-gold">2. Proposed Penalty Fee (INR)</span>
                      <input
                        type="number"
                        required
                        value={damageFee}
                        onChange={(e) => setDamageFee(e.target.value)}
                        placeholder="E.g., 1500"
                        className="w-full p-2 bg-transparent border border-luxury-gold/20 dark:text-white rounded"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <span className="text-[9px] uppercase font-bold text-luxury-gold">3. Damage Description & Evidence Notes</span>
                    <textarea
                      required
                      rows="4"
                      value={damageDesc}
                      onChange={(e) => setDamageDesc(e.target.value)}
                      placeholder="E.g. Large red wine stain on inner raw-silk lining, or minor tear along hem border fabric..."
                      className="w-full p-2 bg-transparent border border-luxury-gold/20 dark:text-white rounded"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest text-[10px] rounded"
                  >
                    Submit Damage Audit Claim
                  </button>
                </form>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default StoreDashboard;
