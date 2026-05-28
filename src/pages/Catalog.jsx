import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  SlidersHorizontal, Search, Heart, Eye, RotateCcw, X, ShoppingBag, Calendar, CheckCircle
} from 'lucide-react';
import dbService from '../services/db';
import SeoHelper from '../components/SeoHelper';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toggleWishlist, isInWishlist } = useCart();
  const { isAuthenticated } = useAuth();
  
  // Database State
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [gender, setGender] = useState(searchParams.get('gender') || 'All');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [storeName, setStoreName] = useState(searchParams.get('storeName') || 'All');
  const [size, setSize] = useState('All');
  const [occasion, setOccasion] = useState('All');
  const [maxPrice, setMaxPrice] = useState(6000);
  const [availability, setAvailability] = useState(false);

  // Quick View Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  // Load products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      // Simulate network request delay
      setTimeout(async () => {
        const data = await dbService.getProducts();
        setAllProducts(data);
        setLoading(false);
      }, 500);
    };
    fetchProducts();
  }, []);

  // Update states when URL query parameters change
  useEffect(() => {
    setSearch(searchParams.get('q') || '');
    setGender(searchParams.get('gender') || 'All');
    setCategory(searchParams.get('category') || 'All');
    setStoreName(searchParams.get('storeName') || 'All');
  }, [searchParams]);

  // Apply filters
  useEffect(() => {
    let result = [...allProducts];

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.fabric.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) || 
        p.storeName.toLowerCase().includes(q)
      );
    }

    // Gender
    if (gender !== 'All') {
      result = result.filter(p => p.gender === gender);
    }

    // Category
    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }

    // Store / Boutique
    if (storeName !== 'All') {
      result = result.filter(p => p.storeName === storeName);
    }

    // Size
    if (size !== 'All') {
      result = result.filter(p => p.sizes.includes(size));
    }

    // Occasion
    if (occasion !== 'All') {
      result = result.filter(p => p.occasion.toLowerCase().includes(occasion.toLowerCase()));
    }

    // Max Price
    result = result.filter(p => p.rentalPricePerDay <= maxPrice);

    // Availability
    if (availability) {
      result = result.filter(p => p.availability === true);
    }

    setFilteredProducts(result);
  }, [allProducts, search, gender, category, storeName, size, occasion, maxPrice, availability]);

  const resetFilters = () => {
    setSearch('');
    setGender('All');
    setCategory('All');
    setStoreName('All');
    setSize('All');
    setOccasion('All');
    setMaxPrice(6000);
    setAvailability(false);
    setSearchParams({});
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  };

  // Get unique options for filter lists
  const boutiqueOptions = [...new Set(allProducts.map(p => p.storeName))];
  const categoryOptions = [...new Set(allProducts.map(p => p.category))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      
      {/* Dynamic SEO Head */}
      <SeoHelper 
        title={`${category !== 'All' ? category : 'Luxury Outfits'} on Rent`}
        description={`Browse our premium catalog of designer wear. Rent wedding lehengas, sherwanis, tuxedos and gowns. Filter by size, price, and boutique.`}
        keywords="designer wear rent catalog, luxury fashion search, rent lehenga online, rent sherwani online"
      />

      <div className="border-b border-luxury-gold/20 pb-6">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-luxury-charcoal dark:text-white">
          The Rental Catalog
        </h1>
        <p className="text-sm font-light text-luxury-charcoal/60 dark:text-luxury-alabaster/60 mt-2">
          Discover a curated selection of designer outfits for weddings, receptions, farewells, and special occasions.
        </p>
      </div>

      {/* Grid: Filters (Left/Top) & Listings (Right/Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* FILTERS PANEL */}
        <div className="lg:col-span-1 bg-white dark:bg-luxury-lightcharcoal rounded-xl border border-luxury-gold/15 p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-luxury-gold/10 pb-4">
            <h2 className="text-base font-bold tracking-wider uppercase flex items-center dark:text-white">
              <SlidersHorizontal size={16} className="text-luxury-gold mr-2" /> Filters
            </h2>
            <button 
              onClick={resetFilters}
              className="text-[10px] font-semibold tracking-widest uppercase text-luxury-gold hover:text-luxury-bronze flex items-center space-x-1"
            >
              <RotateCcw size={10} className="mr-1" /> Reset
            </button>
          </div>

          {/* Search Box */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-wider text-luxury-gold">Search Catalog</label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="E.g., Silk, Sabyasachi..."
                className="w-full pl-9 pr-4 py-2 border border-luxury-gold/25 rounded bg-transparent dark:text-white text-xs focus:outline-none focus:border-luxury-gold"
              />
              <Search className="absolute left-3 top-2.5 text-luxury-gold/50" size={14} />
            </div>
          </div>

          {/* Gender Filter */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-wider text-luxury-gold">Gender</label>
            <div className="grid grid-cols-3 gap-2">
              {['All', 'Women', 'Men'].map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`py-1.5 text-xs font-medium rounded border transition-all ${
                    gender === g 
                      ? 'bg-luxury-gold border-luxury-gold text-white' 
                      : 'border-luxury-gold/20 hover:border-luxury-gold text-luxury-charcoal dark:text-luxury-alabaster'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-wider text-luxury-gold">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-luxury-gold/25 bg-transparent dark:text-white dark:bg-luxury-charcoal rounded text-xs focus:outline-none focus:border-luxury-gold"
            >
              <option value="All">All Categories</option>
              {categoryOptions.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Boutique Filter */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-wider text-luxury-gold">Boutique / Store</label>
            <select
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full p-2 border border-luxury-gold/25 bg-transparent dark:text-white dark:bg-luxury-charcoal rounded text-xs focus:outline-none focus:border-luxury-gold"
            >
              <option value="All">All Boutiques</option>
              {boutiqueOptions.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Size Filter */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-wider text-luxury-gold">Available Sizes</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full p-2 border border-luxury-gold/25 bg-transparent dark:text-white dark:bg-luxury-charcoal rounded text-xs focus:outline-none focus:border-luxury-gold"
            >
              <option value="All">All Sizes</option>
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Occasion Filter */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-wider text-luxury-gold">Occasion</label>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="w-full p-2 border border-luxury-gold/25 bg-transparent dark:text-white dark:bg-luxury-charcoal rounded text-xs focus:outline-none focus:border-luxury-gold"
            >
              <option value="All">All Occasions</option>
              <option value="Wedding">Wedding</option>
              <option value="Reception">Reception</option>
              <option value="Sangeet">Sangeet</option>
              <option value="Mehendi">Mehendi</option>
              <option value="Festival">Festival</option>
              <option value="Farewell">College Farewell</option>
              <option value="Party">Cocktail / Party</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider text-luxury-gold">
              <span>Max Rent Price</span>
              <span>₹{maxPrice.toLocaleString()} / day</span>
            </div>
            <input
              type="range"
              min="1000"
              max="6000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-luxury-gold"
            />
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center space-x-3 pt-2">
            <input
              type="checkbox"
              id="available_now"
              checked={availability}
              onChange={(e) => setAvailability(e.target.checked)}
              className="w-4 h-4 rounded text-luxury-gold focus:ring-luxury-gold border-luxury-gold/30 accent-luxury-gold"
            />
            <label htmlFor="available_now" className="text-xs text-luxury-charcoal/80 dark:text-luxury-alabaster/80 font-medium select-none cursor-pointer">
              Available Immediately
            </label>
          </div>

        </div>

        {/* PRODUCT LISTINGS GRID */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-luxury-charcoal/50 dark:text-luxury-alabaster/50 border-b border-luxury-gold/10 pb-4">
            <p>Showing <span className="font-bold text-luxury-gold">{filteredProducts.length}</span> luxury outfits</p>
          </div>

          {loading ? (
            /* Premium Skeletons Loader */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white dark:bg-luxury-lightcharcoal rounded-xl overflow-hidden border border-luxury-gold/5 h-96 flex flex-col justify-between p-4 space-y-4">
                  <div className="bg-gray-200 dark:bg-gray-800 w-full h-[60%] rounded-lg"></div>
                  <div className="space-y-2 flex-1 pt-4">
                    <div className="bg-gray-200 dark:bg-gray-800 h-3 w-1/3 rounded"></div>
                    <div className="bg-gray-200 dark:bg-gray-800 h-4 w-3/4 rounded"></div>
                    <div className="bg-gray-200 dark:bg-gray-800 h-3 w-1/2 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-luxury-cream/30 border border-dashed border-luxury-gold/20 rounded-xl p-16 text-center space-y-4">
              <SlidersHorizontal size={36} className="mx-auto text-luxury-gold/50" />
              <div>
                <h3 className="font-bold text-base dark:text-white">No Outfits Found</h3>
                <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 mt-1">Try loosening your search terms or expanding your filter ranges.</p>
              </div>
              <button 
                onClick={resetFilters}
                className="px-5 py-2.5 bg-luxury-gold text-white text-xs font-bold uppercase tracking-widest rounded"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  className="group bg-white dark:bg-luxury-lightcharcoal rounded-xl overflow-hidden border border-luxury-gold/10 hover:border-luxury-gold/30 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-[3/4] bg-luxury-cream overflow-hidden">
                    
                    {/* Sanitized Ribbon */}
                    <div className="absolute top-3 left-3 z-10 bg-luxury-charcoal text-white text-[8px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
                      Clean & UV Sealed
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-colors ${
                        isInWishlist(product.id)
                          ? 'bg-red-50 text-red-500 border border-red-200'
                          : 'bg-white/60 hover:bg-white text-luxury-charcoal border border-white/20'
                      }`}
                    >
                      <Heart size={14} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                    </button>

                    <img 
                      src={product.images[0]} 
                      alt={product.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Quick Control Overlays */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end pb-6 z-10 space-y-2">
                      <button
                        onClick={() => handleQuickView(product)}
                        className="px-6 py-2 bg-white text-luxury-charcoal hover:bg-luxury-gold hover:text-white text-[10px] font-bold uppercase tracking-widest rounded flex items-center justify-center space-x-1.5 shadow-lg transition-colors w-40"
                      >
                        <Eye size={12} />
                        <span>Quick View</span>
                      </button>
                      <Link
                        to={`/product/${product.id}`}
                        className="px-6 py-2 bg-luxury-gold text-white hover:bg-luxury-bronze text-[10px] font-bold uppercase tracking-widest rounded flex items-center justify-center space-x-1.5 shadow-lg transition-colors w-40"
                      >
                        <ShoppingBag size={12} />
                        <span>View Details</span>
                      </Link>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 text-left space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[9px] text-luxury-gold font-bold uppercase tracking-widest flex items-center justify-between">
                        <span>{product.storeName}</span>
                        {product.verified && <span className="bg-luxury-gold/20 text-luxury-bronze px-1.5 py-0.5 rounded-[3px] text-[7px]">Verified Boutique</span>}
                      </p>
                      <h3 className="font-semibold text-sm truncate dark:text-white mt-1">{product.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[10px] text-amber-500 font-semibold">★ {product.rating}</span>
                        <span className="text-[9px] text-luxury-charcoal/40 dark:text-luxury-alabaster/40 font-light">({product.reviewsCount} rentals)</span>
                      </div>
                      
                      {/* Available Sizes row */}
                      <div className="flex items-center space-x-1 mt-2.5">
                        <span className="text-[8px] font-bold tracking-widest text-luxury-gold uppercase mr-1">Sizes:</span>
                        {product.sizes.map(s => (
                          <span key={s} className="text-[8px] font-semibold border border-luxury-gold/25 px-1.5 py-0.5 rounded bg-luxury-cream/10 dark:text-white">{s}</span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-luxury-gold/10 mt-3 flex items-end justify-between">
                      <div>
                        <span className="text-[10px] text-luxury-charcoal/45 dark:text-luxury-alabaster/45 line-through">₹{product.originalRetailPrice.toLocaleString()}</span>
                        <p className="text-sm font-bold text-luxury-charcoal dark:text-white">₹{product.rentalPricePerDay.toLocaleString()}/day</p>
                      </div>
                      <span className="text-[9px] font-bold text-green-600 bg-green-500/10 px-2 py-0.5 rounded">
                        Rent at ~{Math.round(product.rentalPricePerDay / product.originalRetailPrice * 100)}%
                      </span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* QUICK VIEW PREVIEW MODAL */}
      {quickViewOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          
          {/* Modal box */}
          <div className="w-full max-w-3xl bg-luxury-alabaster dark:bg-luxury-charcoal border border-luxury-gold/25 rounded-xl shadow-2xl overflow-hidden relative animate-fade-in-up">
            
            {/* Close button */}
            <button 
              onClick={() => { setQuickViewOpen(false); setSelectedProduct(null); }}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-luxury-charcoal text-white hover:bg-luxury-gold transition-colors z-20"
            >
              <X size={16} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              
              {/* Product Image */}
              <div className="aspect-[3/4] bg-luxury-cream relative">
                <img src={selectedProduct.images[0]} alt="" className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4 bg-luxury-charcoal/80 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded">
                  {selectedProduct.category}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-8 text-left space-y-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-[10px] text-luxury-gold font-bold uppercase tracking-widest">{selectedProduct.storeName}</p>
                    <h2 className="text-xl font-bold dark:text-white leading-tight">{selectedProduct.title}</h2>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-amber-500">★ {selectedProduct.rating}</span>
                      <span className="text-luxury-charcoal/40 dark:text-luxury-alabaster/40 font-light">({selectedProduct.reviewsCount} reviews)</span>
                    </div>
                  </div>

                  <p className="text-xs text-luxury-charcoal/70 dark:text-luxury-alabaster/70 font-light leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-luxury-gold block">Seam Sizing</span>
                    <div className="flex space-x-1.5">
                      {selectedProduct.sizes.map(s => (
                        <span key={s} className="px-2.5 py-1 text-xs border border-luxury-gold/30 rounded bg-white dark:bg-luxury-lightcharcoal dark:text-white font-medium">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-luxury-gold/15 flex justify-between items-center">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-luxury-charcoal/50 dark:text-luxury-alabaster/50">Daily Rental</p>
                      <p className="text-xl font-bold text-luxury-charcoal dark:text-white">₹{selectedProduct.rentalPricePerDay.toLocaleString()} / day</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] uppercase tracking-wider text-luxury-charcoal/50 dark:text-luxury-alabaster/50">Refundable Deposit</p>
                      <p className="text-sm font-semibold text-luxury-gold">₹{selectedProduct.securityDeposit.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className="px-4 py-3 border border-luxury-gold text-luxury-gold rounded hover:bg-luxury-cream transition-colors"
                  >
                    <Heart size={16} fill={isInWishlist(selectedProduct.id) ? "currentColor" : "none"} />
                  </button>
                  <Link
                    to={`/product/${selectedProduct.id}`}
                    onClick={() => { setQuickViewOpen(false); setSelectedProduct(null); }}
                    className="flex-1 py-3 bg-luxury-charcoal text-white hover:bg-luxury-gold transition-colors text-center text-xs font-bold uppercase tracking-widest rounded flex items-center justify-center space-x-2"
                  >
                    <ShoppingBag size={14} />
                    <span>Rent Outfit Now</span>
                  </Link>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Catalog;
