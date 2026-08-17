import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart as ReBarChart, Bar, LineChart as ReLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Sparkles, DollarSign, ShoppingBag, RefreshCw, AlertCircle, Plus, Calendar, Settings, Image as ImageIcon, CheckCircle, Tag, BarChart2, Trash2, Edit2, X
} from 'lucide-react';
import { isFirebaseConfigured } from '../services/firebase';
import dbService from '../services/db';
import SeoHelper from '../components/SeoHelper';
import { resizeImage } from '../utils/imageUtils';

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
  const [customCategory, setCustomCategory] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [rentalPrice, setRentalPrice] = useState('');
  const [retailPrice, setRetailPrice] = useState('');
  const [deposit, setDeposit] = useState('');
  const [selectedSizes, setSelectedSizes] = useState(['S', 'M']);
  const [color, setColor] = useState('');
  const [fabric, setFabric] = useState('');
  const [occasion, setOccasion] = useState('Wedding');
  const [customOccasion, setCustomOccasion] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [sizes, setSizes] = useState({ XS: false, S: true, M: true, L: false, XL: false, XXL: false });
  const [stylistNotes, setStylistNotes] = useState('');
  const [desc, setDesc] = useState('');
  const [listingSuccess, setListingSuccess] = useState('');
  const [imageUploading, setImageUploading] = useState(false);

  // Damage filing state
  const [damageBookingId, setDamageBookingId] = useState('');
  const [damageDesc, setDamageDesc] = useState('');
  const [damageFee, setDamageFee] = useState('');
  const [damageSuccess, setDamageSuccess] = useState('');

  // Settings state
  const [boutiqueData, setBoutiqueData] = useState(null);
  const [storeCoverImage, setStoreCoverImage] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // Admin Impersonation State
  const [adminBoutiques, setAdminBoutiques] = useState([]);
  const [selectedAdminBoutiqueId, setSelectedAdminBoutiqueId] = useState(null);

  const loadBoutiqueData = async () => {
    if (!user) return;
    
    // Admin Impersonation Mode: Fetch boutiques list if admin and no boutique selected
    if (user.role === 'admin' && !selectedAdminBoutiqueId) {
      const allBouts = await dbService.getBoutiques();
      setAdminBoutiques(allBouts);
      return;
    }

    const targetBoutiqueId = user.role === 'admin' ? selectedAdminBoutiqueId : user.boutiqueId;
    if (!targetBoutiqueId) return;
    
    // Load products matching this boutique
    const allProds = await dbService.getProducts();
    const boutiqueProds = allProds.filter(p => p.storeId === targetBoutiqueId);
    setProducts(boutiqueProds);

    // Load bookings matching storeId
    const allOrders = await dbService.getOrders({ storeId: targetBoutiqueId });
    setBookings(allOrders);

    // Load disputes
    const allDisps = await dbService.getDisputes();
    const storeDisps = allDisps.filter(d => d.storeId === targetBoutiqueId);
    setDisputes(storeDisps);

    // Load Boutique Profile
    const bData = await dbService.getBoutique(targetBoutiqueId);
    if (bData) {
      setBoutiqueData(bData);
      setStoreCoverImage(bData.coverImage || '');
    }
  };

  useEffect(() => {
    loadBoutiqueData();
  }, [user, activeTab, selectedAdminBoutiqueId]);

  const handleImageUpload = async (e) => {
    const rawFiles = Array.from(e.target.files);
    if (!rawFiles || rawFiles.length === 0) return;

    if (imageUrls.length + rawFiles.length > 4) {
      alert('You can upload a maximum of 4 images per outfit.');
      return;
    }

    try {
      setImageUploading(true);
      
      const newBase64Images = await Promise.all(rawFiles.map(async (rawFile) => {
        // Resize and compress aggressively (Max 800x800px, 70% Quality) to fit 1MB limit
        const file = await resizeImage(rawFile, 800, 800, 0.7);
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }));

      setImageUrls(prev => [...prev, ...newBase64Images]);
      setImageUploading(false);
      console.log("Images successfully converted to Base64 for Firestore storage.");
    } catch (err) {
      console.error('Image processing failed', err);
      alert('Failed to process images. Please try again. Error: ' + (err?.message || String(err)));
      setImageUploading(false);
    }
  };

  const removeImage = (index) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    setListingSuccess('');

    if (!title || !rentalPrice || !retailPrice || imageUrls.length === 0) {
      alert('Please fill all required fields and upload at least one image.');
      return;
    }

    const finalCategory = category === 'Other (Custom)' ? customCategory : category;
    const finalOccasion = occasion === 'Other (Custom)' ? customOccasion : occasion;

    if (category === 'Other (Custom)' && !finalCategory) {
      alert('Please specify a custom category.');
      return;
    }
    if (occasion === 'Other (Custom)' && !finalOccasion) {
      alert('Please specify a custom occasion.');
      return;
    }

    const productData = {
      title,
      category: finalCategory,
      gender,
      images: imageUrls,
      rentalPricePerDay: Number(rentalPrice),
      originalRetailPrice: Number(retailPrice),
      securityDeposit: Number(deposit),
      sizes: selectedSizes,
      colors: [color],
      fabric,
      occasion: finalOccasion,
      description: desc,
      stylistNotes
    };

    try {
      if (editingId) {
        await dbService.updateProduct(editingId, productData);
        setListingSuccess('🎉 Luxury Listing updated successfully!');
      } else {
        const newProduct = {
          ...productData,
          storeId: user.role === 'admin' ? selectedAdminBoutiqueId : user.boutiqueId,
          storeName: boutiqueData?.name || user.displayName,
          rating: 5.0,
          reviewsCount: 0,
          availability: true,
          bookedDates: [],
          cleanlinessRating: 5.0,
          verified: true
        };
        await dbService.addProduct(newProduct);
        setListingSuccess('🎉 Luxury Listing added to live catalog successfully!');
      }
      
      // Refresh the local inventory list immediately so changes are visible
      loadBoutiqueData();
      
      // Reset Form
      setTitle('');
      setCategory('Designer Lehengas');
      setCustomCategory('');
      setImageUrls([]);
      setRentalPrice('');
      setRetailPrice('');
      setDeposit('');
      setColor('');
      setFabric('');
      setOccasion('Wedding');
      setCustomOccasion('');
      setStylistNotes('');
      setDesc('');
      setEditingId(null);
    } catch (err) {
      alert('Failed to save listing: ' + (err.message || String(err)));
    }
  };

  const handleDeleteListing = async (id) => {
    if (window.confirm('Are you sure you want to completely remove this outfit from your catalog?')) {
      try {
        await dbService.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        alert('Failed to delete listing: ' + (err.message || String(err)));
      }
    }
  };

  const handleStoreImageUpload = async (e) => {
    const rawFile = e.target.files[0];
    if (!rawFile) return;

    try {
      setImageUploading(true);
      const file = await resizeImage(rawFile, 1200, 800, 0.7);
      const reader = new FileReader();
      reader.onloadend = () => {
        setStoreCoverImage(reader.result);
        setImageUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      alert('Failed to process image. ' + String(err));
      setImageUploading(false);
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    if (!user?.boutiqueId) return;
    try {
      await dbService.updateBoutique(user.boutiqueId, {
        coverImage: storeCoverImage
      });
      setSettingsSuccess('🎉 Store profile picture updated successfully!');
      setTimeout(() => setSettingsSuccess(''), 3000);
      loadBoutiqueData();
    } catch (err) {
      alert('Failed to update settings: ' + String(err));
    }
  };

  const handleEditListing = (product) => {
    setEditingId(product.id);
    setTitle(product.title || '');
    setDesc(product.description || '');
    setRentalPrice(product.rentalPricePerDay?.toString() || '');
    setRetailPrice(product.originalRetailPrice?.toString() || '');
    setDeposit(product.securityDeposit?.toString() || '');
    setCategory(product.category || 'Designer Lehengas');
    setCustomCategory('');
    setGender(product.gender || 'Women');
    setOccasion(product.occasion || 'Wedding');
    setCustomOccasion('');
    setColor(product.colors?.[0] || '');
    setFabric(product.fabric || '');
    setStylistNotes(product.stylistNotes || '');
    setImageUrls(product.images || []);
    if (product.sizes) setSelectedSizes(product.sizes);
    setActiveTab('new-listing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

      {user?.role === 'admin' && !selectedAdminBoutiqueId ? (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight text-luxury-charcoal dark:text-white">Admin: Select Boutique to Manage</h1>
          <p className="text-sm font-light text-luxury-charcoal/50 dark:text-luxury-alabaster/50">
            Choose a boutique to impersonate their Store Console. Any changes you make will be saved directly to their account.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminBoutiques.map(boutique => (
              <div key={boutique.id} className="bg-white dark:bg-luxury-lightcharcoal p-6 rounded-xl border border-luxury-gold/15 shadow-sm space-y-4">
                <h3 className="font-playfair text-xl font-bold dark:text-white">{boutique.name}</h3>
                <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 uppercase tracking-widest">
                  Owner ID: {boutique.ownerId.slice(0, 8)}...
                </p>
                <div className="pt-4 border-t border-luxury-gold/10">
                  <button 
                    onClick={() => setSelectedAdminBoutiqueId(boutique.id)}
                    className="w-full py-2 bg-luxury-gold text-white text-[10px] font-bold tracking-widest uppercase rounded hover:bg-luxury-bronze transition-colors"
                  >
                    Manage Store
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
              <h1 className="text-3xl font-bold tracking-tight text-luxury-charcoal dark:text-white">Boutique Console</h1>
              <p className="text-sm font-light text-luxury-charcoal/50 dark:text-luxury-alabaster/50 mt-1 flex items-center">
                <span>Store: <strong className="font-semibold text-luxury-gold">{boutiqueData?.name || user?.displayName}</strong></span>
                {user?.role === 'admin' && (
                  <button onClick={() => setSelectedAdminBoutiqueId(null)} className="ml-4 px-2 py-1 bg-luxury-gold/10 text-luxury-gold rounded text-[10px] uppercase font-bold tracking-widest hover:bg-luxury-gold/20 transition-colors">
                    &larr; Switch Boutique
                  </button>
                )}
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
            { id: 'damages', label: 'File Damage Claim', badge: disputes.length },
            { id: 'settings', label: 'Store Settings' }
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
                    <div key={p.id} className="p-4 border border-luxury-gold/15 bg-white dark:bg-luxury-lightcharcoal rounded-xl flex items-center space-x-4 relative">
                      <img src={p.images[0]} alt="" className="w-14 h-20 object-cover rounded bg-luxury-cream flex-shrink-0" />
                      <div className="text-left min-w-0 flex-1 pr-16">
                        <h4 className="font-bold text-sm truncate dark:text-white">{p.title}</h4>
                        <p className="text-[10px] text-luxury-gold font-bold uppercase tracking-widest mt-0.5">{p.category}</p>
                        <div className="flex items-center justify-between pt-2 mt-2 border-t border-luxury-gold/10 text-xs">
                          <span className="font-bold dark:text-white">₹{p.rentalPricePerDay}/day</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${p.availability ? 'bg-green-500/10 text-green-600' : 'bg-red-500/15 text-red-600'}`}>
                            {p.availability ? 'Active' : 'Booked'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="absolute right-4 top-4 flex flex-col space-y-2">
                        <button onClick={() => handleEditListing(p)} className="p-1.5 bg-luxury-gold/10 hover:bg-luxury-gold/30 text-luxury-gold rounded transition-colors" title="Edit Listing">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDeleteListing(p.id)} className="p-1.5 bg-red-500/10 hover:bg-red-500/30 text-red-500 rounded transition-colors" title="Delete Listing">
                          <Trash2 size={14} />
                        </button>
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
                {editingId ? 'Edit Luxury Design' : 'Register New Luxury Design'}
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
                      <option value="Other (Custom)">Other (Custom)</option>
                    </select>
                    {category === 'Other (Custom)' && (
                      <input
                        type="text"
                        required
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="E.g. Jodhpuri Suit"
                        className="w-full p-2 mt-2 bg-transparent border border-luxury-gold/20 dark:text-white rounded text-xs"
                      />
                    )}
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
                      <option value="College Farewell">College Farewell</option>
                      <option value="Party / Cocktail">Party / Cocktail</option>
                      <option value="Other (Custom)">Other (Custom)</option>
                    </select>
                    {occasion === 'Other (Custom)' && (
                      <input
                        type="text"
                        required
                        value={customOccasion}
                        onChange={(e) => setCustomOccasion(e.target.value)}
                        placeholder="E.g. Engagement"
                        className="w-full p-2 mt-2 bg-transparent border border-luxury-gold/20 dark:text-white rounded text-xs"
                      />
                    )}
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
                  <span className="text-[9px] uppercase font-bold text-luxury-gold">Images (Max 4)</span>
                  <div className="flex items-start space-x-4">
                    {imageUrls.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {imageUrls.map((url, i) => (
                          <div key={i} className="relative w-16 h-20 group">
                            <img src={url} alt={`Preview ${i+1}`} className="w-full h-full object-cover rounded bg-luxury-gold/10 border border-luxury-gold/30" />
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove Image"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {imageUrls.length < 4 && (
                      <div className="flex-1 relative mt-1">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={imageUploading}
                          className="w-full p-2 bg-transparent border border-luxury-gold/20 dark:text-white rounded file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-luxury-gold/10 file:text-luxury-gold hover:file:bg-luxury-gold/20 file:cursor-pointer disabled:opacity-50"
                        />
                        {imageUploading && (
                          <div className="absolute inset-y-0 right-3 flex items-center">
                            <svg className="animate-spin h-4 w-4 text-luxury-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
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

                <div className="flex flex-col space-y-3 pt-4">
                  <button type="submit" className="w-full py-4 bg-luxury-gold text-white font-bold tracking-widest uppercase text-xs hover:bg-luxury-bronze transition-colors duration-300">
                    {editingId ? 'Update Luxury Design' : 'Publish Luxury Design'}
                  </button>
                  {editingId && (
                    <button type="button" onClick={() => {
                      setEditingId(null);
                      setTitle(''); setCategory('Designer Lehengas'); setCustomCategory('');
                      setImageUrls([]); setRentalPrice(''); setRetailPrice(''); setDeposit('');
                      setColor(''); setFabric(''); setOccasion('Wedding'); setCustomOccasion('');
                      setStylistNotes(''); setDesc(''); setListingSuccess('');
                      setActiveTab('listings');
                    }} className="w-full py-3 bg-transparent border border-luxury-gold/20 text-luxury-gold font-bold tracking-widest uppercase text-xs hover:bg-luxury-gold/10 transition-colors duration-300">
                      Cancel Edit
                    </button>
                  )}
                </div>

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

          {/* TAB 6: STORE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold tracking-wider uppercase border-b border-luxury-gold/10 pb-3 dark:text-white">
                Store Profile Settings
              </h2>
              
              {settingsSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded text-xs font-semibold">
                  {settingsSuccess}
                </div>
              )}

              <form onSubmit={handleUpdateSettings} className="bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 p-6 rounded-xl space-y-6 text-xs font-light">
                <div className="space-y-1.5 text-left">
                  <span className="text-[9px] uppercase font-bold text-luxury-gold">Boutique Name</span>
                  <input
                    type="text"
                    disabled
                    value={boutiqueData?.name || user?.displayName || ''}
                    className="w-full p-2 bg-transparent border border-luxury-gold/20 dark:text-white rounded opacity-50 cursor-not-allowed"
                  />
                  <p className="text-[9px] text-luxury-charcoal/40 dark:text-luxury-alabaster/40 mt-1">To change boutique name, please contact Paridhan support.</p>
                </div>

                <div className="space-y-1.5 text-left">
                  <span className="text-[9px] uppercase font-bold text-luxury-gold">Store Cover Picture</span>
                  <p className="text-[9px] text-luxury-charcoal/50 dark:text-luxury-alabaster/50 pb-2">This image appears as the main background image on your boutique's card in the Verified Partners section.</p>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    {storeCoverImage ? (
                      <div className="relative w-40 h-24 group">
                        <img src={storeCoverImage} alt="Cover Preview" className="w-full h-full object-cover rounded border border-luxury-gold/30 shadow-sm" />
                        <button
                          type="button"
                          onClick={() => setStoreCoverImage('')}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-40 h-24 rounded border border-dashed border-luxury-gold/30 flex items-center justify-center text-luxury-gold/50 bg-luxury-gold/5">
                        <ImageIcon size={24} />
                      </div>
                    )}
                    
                    <div className="flex-1 relative w-full sm:w-auto">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleStoreImageUpload}
                        disabled={imageUploading}
                        className="w-full p-2 bg-transparent border border-luxury-gold/20 dark:text-white rounded file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-luxury-gold/10 file:text-luxury-gold hover:file:bg-luxury-gold/20 file:cursor-pointer disabled:opacity-50"
                      />
                      {imageUploading && (
                        <div className="absolute inset-y-0 right-3 flex items-center">
                          <svg className="animate-spin h-4 w-4 text-luxury-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-luxury-gold/10 text-right">
                  <button
                    type="submit"
                    disabled={imageUploading}
                    className="px-6 py-2.5 bg-luxury-gold text-white font-bold uppercase tracking-widest text-[10px] rounded hover:bg-luxury-bronze transition-colors disabled:opacity-50"
                  >
                    Save Changes
                  </button>
                </div>
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

export default StoreDashboard;
