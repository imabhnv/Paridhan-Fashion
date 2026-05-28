import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  Trash2, ArrowRight, ShieldCheck, Ticket, Calendar, ShieldAlert, ShoppingBag
} from 'lucide-react';
import SeoHelper from '../components/SeoHelper';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    cart, removeFromCart, coupon, discountPercent, subtotal,
    totalSecurityDeposit, discountAmount, gstAmount, serviceFee, grandTotal,
    applyCoupon, removeCoupon
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    if (!couponCode) return;
    
    const res = applyCoupon(couponCode);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponCode('');
    } else {
      setCouponError(res.message);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Redirect to auth first with return destination
      navigate('/auth?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left animate-fade-in">
      
      {/* SEO dynamic page metadata */}
      <SeoHelper 
        title="Your Rental Cart"
        description="Review your luxury outfits cart, apply coupons, and calculate rental deposits before checkout."
        keywords="fashion rental bag, paridhan checkout, rent summary"
      />

      <div className="border-b border-luxury-gold/20 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-luxury-charcoal dark:text-white">Your Rental Bag</h1>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 rounded-xl p-16 text-center space-y-6 max-w-xl mx-auto">
          <ShoppingBag size={48} className="mx-auto text-luxury-gold/50" />
          <div>
            <h3 className="font-bold text-base dark:text-white">Your bag is empty</h3>
            <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 mt-1">
              Explore our designer catalog to rent your dream outfit for weddings and parties.
            </p>
          </div>
          <Link
            to="/catalog"
            className="inline-block px-8 py-3.5 bg-luxury-gold text-white text-xs font-bold uppercase tracking-widest rounded shadow-md hover:bg-luxury-bronze"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CART ITEMS LIST */}
          <div className="lg:col-span-8 space-y-6">
            {cart.map((item) => (
              <div 
                key={item.cartItemId} 
                className="bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-center space-x-4">
                  <img src={item.product.images[0]} alt="" className="w-16 h-22 object-cover rounded bg-luxury-cream flex-shrink-0" />
                  <div className="space-y-1 text-left">
                    <p className="text-[9px] text-luxury-gold font-bold uppercase tracking-widest">{item.product.storeName}</p>
                    <h3 className="font-bold text-sm dark:text-white">{item.product.title}</h3>
                    <div className="flex flex-wrap gap-2 text-[10px] text-luxury-charcoal/50 dark:text-luxury-alabaster/50 pt-1">
                      <span>Size: <strong className="text-luxury-charcoal dark:text-white font-medium">{item.size}</strong></span>
                      <span>•</span>
                      <span>Color: <strong className="text-luxury-charcoal dark:text-white font-medium">{item.color}</strong></span>
                      <span>•</span>
                      <span>Duration: <strong className="text-luxury-charcoal dark:text-white font-medium">{item.rentalDays} Days</strong></span>
                    </div>
                    {/* Booking Dates info */}
                    <div className="flex items-center text-[10px] text-luxury-gold font-medium bg-luxury-gold/5 px-2 py-0.5 rounded border border-luxury-gold/10 mt-1 max-w-max">
                      <Calendar size={10} className="mr-1" />
                      <span>{item.startDate} to {item.endDate}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Pricing & Deletes */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-luxury-gold/10">
                  <div className="text-left sm:text-right space-y-0.5">
                    <p className="text-xs text-luxury-charcoal/45 dark:text-luxury-alabaster/45">₹{item.product.rentalPricePerDay} x {item.rentalDays} days</p>
                    <p className="text-sm font-bold text-luxury-charcoal dark:text-white">₹{item.rentalCost.toLocaleString()}</p>
                    <p className="text-[10px] text-luxury-gold">Deposit: ₹{item.securityDeposit.toLocaleString()} (Refundable)</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full transition-colors sm:mt-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {/* Damage protection highlight info */}
            <div className="p-4 bg-luxury-cream/40 dark:bg-luxury-lightcharcoal/40 border border-luxury-gold/15 rounded-xl flex items-start space-x-3 text-xs leading-relaxed font-light text-luxury-charcoal/70 dark:text-luxury-alabaster/70">
              <ShieldCheck size={20} className="text-luxury-gold flex-shrink-0" />
              <div>
                <span className="font-semibold text-luxury-charcoal dark:text-white block mb-0.5">Complementary Basic Alteration & Damage Cover</span>
                Minor stains, loose embroidery, and small zipper issues are automatically covered. Professional fitting updates are stitched temporarily according to your measurements.
              </div>
            </div>
          </div>

          {/* PRICING CARD */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 rounded-xl p-6 shadow-md space-y-5">
              <h2 className="text-sm font-bold tracking-wider uppercase border-b border-luxury-gold/10 pb-3 dark:text-white">
                Price Summary
              </h2>

              {/* Coupon inputs */}
              <div className="space-y-2 border-b border-luxury-gold/10 pb-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-luxury-gold block">Apply Coupon Code</span>
                
                {coupon ? (
                  <div className="flex items-center justify-between bg-luxury-gold/10 border border-luxury-gold/30 p-2.5 rounded text-xs">
                    <span className="text-luxury-bronze font-bold flex items-center">
                      <Ticket size={12} className="mr-1.5" /> {coupon} (-{discountPercent}%)
                    </span>
                    <button 
                      onClick={removeCoupon}
                      className="text-red-500 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="WELCOME10, FESTIVE20"
                      className="flex-1 px-3 py-2 border border-luxury-gold/25 bg-transparent dark:text-white text-xs rounded focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 bg-luxury-charcoal text-white hover:bg-luxury-gold text-xs font-bold uppercase tracking-widest rounded"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponError && <p className="text-[10px] text-red-500 font-semibold">{couponError}</p>}
                {couponSuccess && <p className="text-[10px] text-green-600 font-semibold">{couponSuccess}</p>}
              </div>

              {/* Itemized Price items */}
              <div className="space-y-3.5 text-xs text-luxury-charcoal/70 dark:text-luxury-alabaster/70 font-light border-b border-luxury-gold/10 pb-4">
                <div className="flex justify-between">
                  <span>Rental Subtotal</span>
                  <span className="font-semibold text-luxury-charcoal dark:text-white">₹{subtotal.toLocaleString()}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>18% GST (Luxury Services)</span>
                  <span className="font-semibold text-luxury-charcoal dark:text-white">₹{gstAmount.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Handover & Return Logistics Fee</span>
                  <span className="font-semibold text-luxury-charcoal dark:text-white">₹{serviceFee.toLocaleString()}</span>
                </div>

                <div className="flex justify-between border-t border-dashed border-luxury-gold/10 pt-3">
                  <span className="font-medium text-luxury-charcoal dark:text-white">Refundable Security Deposit</span>
                  <span className="font-bold text-luxury-gold">₹{totalSecurityDeposit.toLocaleString()}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-luxury-gold">Grand Total</p>
                  <p className="text-xl font-bold text-luxury-charcoal dark:text-white">₹{grandTotal.toLocaleString()}</p>
                </div>
                <div className="text-right text-[9px] text-luxury-charcoal/40 dark:text-luxury-alabaster/40 font-light leading-snug">
                  *includes deposit.<br />
                  Deposit refunded on return check.
                </div>
              </div>

              {/* Checkout button */}
              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-luxury-charcoal text-white hover:bg-luxury-gold transition-colors text-center text-xs font-bold uppercase tracking-widest rounded flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={14} />
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[9px] text-luxury-charcoal/50 dark:text-luxury-alabaster/50 pt-2">
                <ShieldCheck size={12} className="text-luxury-gold" />
                <span>Secured SSL Checkout & Secure Refund Guarantees</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default Cart;
