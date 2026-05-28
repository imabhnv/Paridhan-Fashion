import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, Calendar, Truck, Sparkles, ShieldCheck, MapPin, ArrowLeft, Star, ShoppingBag, Info
} from 'lucide-react';
import dbService from '../services/db';
import SeoHelper from '../components/SeoHelper';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { isAuthenticated } = useAuth();

  // Product State
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  
  // Booking Parameters
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [rentalDays, setRentalDays] = useState(3); // Default 3 days
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Checking scheduling conflicts
  const [schedulingError, setSchedulingError] = useState('');

  // Delivery check state
  const [pincode, setPincode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState('');

  // Recommendations
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      const match = await dbService.getProduct(id);
      if (match) {
        setProduct(match);
        setActiveImage(match.images[0]);
        setSelectedSize(match.sizes[0]);
        setSelectedColor(match.colors[0]);

        // Load similar category recommendation items
        const allProds = await dbService.getProducts();
        const recs = allProds.filter(p => p.category === match.category && p.id !== match.id).slice(0, 4);
        setRecommendations(recs);
      }
      setLoading(false);
    };
    fetchProductDetails();
  }, [id]);

  // Update End Date automatically when Start Date or Duration changes
  useEffect(() => {
    if (startDate) {
      const start = new Date(startDate);
      const end = new Date(start);
      // If renting for N days, checkout is N-1 days after start date
      end.setDate(start.getDate() + (Number(rentalDays) - 1));
      
      const formattedEndDate = end.toISOString().split('T')[0];
      setEndDate(formattedEndDate);

      // Verify Scheduling Conflict
      if (product) {
        const conflict = checkConflict(startDate, formattedEndDate, product.bookedDates || []);
        if (conflict) {
          setSchedulingError('⚠️ These dates conflict with an existing booking. Please pick another slot.');
        } else {
          setSchedulingError('');
        }
      }
    }
  }, [startDate, rentalDays, product]);

  // Conflict Checking Logic
  const checkConflict = (startStr, endStr, bookedDates) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    let current = new Date(start);
    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      if (bookedDates.includes(dateStr)) {
        return true;
      }
      current.setDate(current.getDate() + 1);
    }
    return false;
  };

  const handleCheckDelivery = (e) => {
    e.preventDefault();
    if (pincode.length !== 6) {
      setDeliveryStatus('❌ Please enter a valid 6-digit PIN code.');
      return;
    }
    // Simulate standard metro checks
    const firstDigit = pincode[0];
    if (['1', '2', '3', '4', '5', '6', '7'].includes(firstDigit)) {
      setDeliveryStatus('✅ Guaranteed delivery & sizing tailors available at this pincode.');
    } else {
      setDeliveryStatus('⚠️ Delivery takes 4-5 business days. Temporary fittings not available here.');
    }
  };

  const handleRentNow = () => {
    if (!startDate) {
      alert("Please select a Rental Start Date first.");
      return;
    }
    if (schedulingError) {
      alert("Please resolve the scheduling conflict before checking out.");
      return;
    }
    
    addToCart(product, selectedSize, selectedColor, rentalDays, startDate, endDate);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-alabaster dark:bg-luxury-charcoal">
        <div className="w-12 h-12 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold dark:text-white">Outfit Not Found</h2>
        <p className="text-sm text-luxury-charcoal/60 dark:text-luxury-alabaster/60">This luxury item may have been archives by the store boutique.</p>
        <Link to="/catalog" className="inline-block px-5 py-2.5 bg-luxury-gold text-white text-xs font-bold uppercase tracking-widest rounded">
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 text-left">
      
      {/* Dynamic SEO Meta Tags */}
      <SeoHelper 
        title={product.title}
        description={`Rent ${product.title} from ${product.storeName} for weddings, parties, or special occasions. Book at just ₹${product.rentalPricePerDay}/day with free sizing fittings.`}
        keywords={`${product.title}, rent designer wear, ${product.category} rent, Sabyasachi rent`}
        schemaMarkup={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.title,
          "image": product.images,
          "description": product.description,
          "offers": {
            "@type": "Offer",
            "priceCurrency": "INR",
            "price": product.rentalPricePerDay,
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "LocalBusiness",
              "name": product.storeName
            }
          }
        }}
      />

      {/* Back button */}
      <div>
        <Link to="/catalog" className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-luxury-gold hover:text-luxury-bronze">
          <ArrowLeft size={14} className="mr-1.5" /> Back to Catalog
        </Link>
      </div>

      {/* Grid: Gallery (Left) & Config Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[3/4] rounded-xl overflow-hidden bg-luxury-cream border border-luxury-gold/15 shadow-md relative">
            
            {/* Sanitization badge */}
            <div className="absolute top-4 left-4 z-10 luxury-glass-dark px-3 py-1.5 rounded flex items-center space-x-2 text-white">
              <ShieldCheck size={16} className="text-luxury-brightgold" />
              <span className="text-[9px] uppercase font-bold tracking-widest">UV Sanitized & QC Passed</span>
            </div>

            <img src={activeImage} alt={product.title} className="w-full h-full object-cover transition-all" />
          </div>

          {/* Thumbnail list */}
          <div className="flex space-x-3 overflow-x-auto pb-1">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-20 h-24 rounded-lg overflow-hidden border bg-luxury-cream flex-shrink-0 transition-all ${
                  activeImage === img ? 'border-luxury-gold ring-1 ring-luxury-gold/30' : 'border-luxury-gold/10 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Configuration */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="space-y-2">
            <p className="text-[10px] uppercase font-bold tracking-widest text-luxury-gold flex items-center justify-between">
              <span>{product.storeName}</span>
              <span className="bg-luxury-gold/20 text-luxury-bronze px-2 py-0.5 rounded text-[8px]">Verified Partner</span>
            </p>
            <h1 className="text-2xl md:text-3.5xl font-bold dark:text-white leading-tight">{product.title}</h1>
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex text-amber-500 space-x-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-luxury-charcoal/40 dark:text-luxury-alabaster/40 font-light">({product.reviewsCount} verified bookings)</span>
            </div>
          </div>

          <div className="pt-4 border-t border-b border-luxury-gold/15 py-4 flex justify-between items-end">
            <div>
              <p className="text-[9px] uppercase tracking-wider text-luxury-charcoal/50 dark:text-luxury-alabaster/50">Rental Price</p>
              <p className="text-2xl font-bold text-luxury-charcoal dark:text-white">₹{product.rentalPricePerDay.toLocaleString()} <span className="text-xs font-normal text-luxury-charcoal/50 dark:text-luxury-alabaster/50">/ day</span></p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center text-[9px] uppercase tracking-wider text-luxury-charcoal/50 dark:text-luxury-alabaster/50">
                Refundable Deposit <Info size={10} className="ml-1 text-luxury-gold cursor-pointer" title="Fully refunded on return inspection." />
              </div>
              <p className="text-lg font-semibold text-luxury-gold">₹{product.securityDeposit.toLocaleString()}</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-luxury-gold">Outfit Description</h3>
            <p className="text-xs md:text-sm text-luxury-charcoal/75 dark:text-luxury-alabaster/75 font-light leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Configuration Forms */}
          <div className="space-y-4 pt-2">
            
            {/* Size & Color Choice */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-gold block">1. Selected Size</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full p-2.5 border border-luxury-gold/25 bg-white dark:bg-luxury-charcoal dark:text-white rounded text-xs focus:outline-none focus:border-luxury-gold"
                >
                  {product.sizes.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-gold block">2. Selected Color</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full p-2.5 border border-luxury-gold/25 bg-white dark:bg-luxury-charcoal dark:text-white rounded text-xs focus:outline-none focus:border-luxury-gold"
                >
                  {product.colors.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rental Duration & Dates */}
            <div className="space-y-3 bg-luxury-cream/35 dark:bg-luxury-lightcharcoal/40 p-4 rounded-lg border border-luxury-gold/15">
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-luxury-gold flex items-center">
                <Calendar size={12} className="mr-1.5 text-luxury-gold" />
                3. Choose Rental Dates & Duration
              </h3>
              
              {/* Duration select */}
              <div className="flex space-x-2">
                {[3, 5, 7].map((days) => (
                  <button
                    key={days}
                    onClick={() => setRentalDays(days)}
                    className={`flex-1 py-2 text-xs font-semibold border rounded transition-all ${
                      rentalDays === days
                        ? 'bg-luxury-gold border-luxury-gold text-white'
                        : 'border-luxury-gold/25 hover:border-luxury-gold dark:text-white'
                    }`}
                  >
                    {days} Days Rental
                  </button>
                ))}
              </div>

              {/* Date Inputs */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-semibold text-luxury-charcoal/50 dark:text-luxury-alabaster/50">Start Date</span>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border border-luxury-gold/25 bg-white dark:bg-luxury-charcoal dark:text-white rounded text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-semibold text-luxury-charcoal/50 dark:text-luxury-alabaster/50">End Date</span>
                  <input
                    type="date"
                    disabled
                    value={endDate}
                    className="w-full p-2 border border-luxury-gold/10 bg-luxury-cream dark:bg-luxury-lightcharcoal dark:text-white/60 rounded text-xs cursor-not-allowed"
                  />
                </div>
              </div>

              {schedulingError && (
                <p className="text-[10px] text-red-500 font-semibold tracking-wide animate-pulse">
                  {schedulingError}
                </p>
              )}
            </div>

            {/* Delivery Estimation Checker */}
            <form onSubmit={handleCheckDelivery} className="space-y-2 border border-luxury-gold/10 p-4 rounded-lg">
              <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-gold flex items-center">
                <Truck size={12} className="mr-1.5 text-luxury-gold" />
                4. Check Location Availability
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  maxLength="6"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit Pincode (e.g. 400049)"
                  className="flex-1 px-3 py-2 border border-luxury-gold/25 bg-transparent dark:text-white rounded text-xs focus:outline-none focus:border-luxury-gold"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-luxury-charcoal hover:bg-luxury-gold text-white text-[10px] font-bold uppercase tracking-widest rounded"
                >
                  Verify
                </button>
              </div>
              {deliveryStatus && (
                <p className="text-[10px] font-medium tracking-wide mt-1 animate-fade-in text-luxury-charcoal/80 dark:text-luxury-alabaster/80">
                  {deliveryStatus}
                </p>
              )}
            </form>

          </div>

          {/* Action buttons */}
          <div className="flex space-x-4 pt-4 border-t border-luxury-gold/15">
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`px-5 py-4 border rounded-md transition-colors ${
                isInWishlist(product.id)
                  ? 'bg-red-50 border-red-200 text-red-500'
                  : 'border-luxury-gold text-luxury-gold hover:bg-luxury-cream'
              }`}
            >
              <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleRentNow}
              className="flex-1 py-4 bg-luxury-charcoal text-white hover:bg-luxury-gold transition-colors text-center text-xs font-bold uppercase tracking-widest rounded-md flex items-center justify-center space-x-2"
            >
              <ShoppingBag size={16} />
              <span>Rent Outfit Now</span>
            </button>
          </div>

        </div>

      </div>

      {/* METRICS & DETAILS DETAIL CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-luxury-gold/15">
        
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-luxury-gold">Fabrication Details</span>
          <p className="text-sm dark:text-white font-medium">{product.fabric}</p>
          <p className="text-xs text-luxury-charcoal/50 dark:text-luxury-alabaster/50 font-light">Professionally dry-cleaned after every single rental usage.</p>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-luxury-gold">Stylist Fit Consultation</span>
          <p className="text-sm dark:text-white font-medium">{product.stylistNotes}</p>
          <p className="text-xs text-luxury-charcoal/50 dark:text-luxury-alabaster/50 font-light">Need personal fits? Our local boutique partner will stitch-adjust this for you.</p>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-luxury-gold">Cleanliness Standard SLA</span>
          <div className="flex items-center space-x-1.5 text-sm dark:text-white font-medium">
            <ShieldCheck className="text-green-500" size={16} />
            <span>Grade {product.cleanlinessRating.toFixed(1)} / 5.0 Hygiene</span>
          </div>
          <p className="text-xs text-luxury-charcoal/50 dark:text-luxury-alabaster/50 font-light">Passed professional fabric and cleanliness quality testing inspection.</p>
        </div>

      </div>

      {/* RECOMMENDATIONS (Similar outfits) */}
      {recommendations.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-luxury-gold/15">
          <h2 className="text-xl font-bold dark:text-white">Similar Couture Pieces</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations.map(p => (
              <Link 
                key={p.id} 
                to={`/product/${p.id}`}
                className="group space-y-3 block"
              >
                <div className="aspect-[3/4] bg-luxury-cream rounded-lg overflow-hidden border border-luxury-gold/10 group-hover:border-luxury-gold/30 transition-all">
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] text-luxury-gold font-bold uppercase tracking-widest">{p.storeName}</p>
                  <h4 className="text-xs font-semibold truncate dark:text-white">{p.title}</h4>
                  <p className="text-xs font-bold dark:text-white mt-1">₹{p.rentalPricePerDay}/day</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetail;
