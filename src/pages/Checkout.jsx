import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  CreditCard, MapPin, Truck, Plus, ShieldCheck, CheckCircle2, X, AlertCircle
} from 'lucide-react';
import dbService from '../services/db';
import SeoHelper from '../components/SeoHelper';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const { cart, grandTotal, subtotal, totalSecurityDeposit, gstAmount, serviceFee, discountAmount, coupon, clearCart } = useCart();

  // Selection states
  const [selectedAddressId, setSelectedAddressId] = useState(
    user?.addresses?.find(a => a.default)?.id || user?.addresses?.[0]?.id || ''
  );
  const [newAddressFormOpen, setNewAddressFormOpen] = useState(false);
  
  // New address state
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newZip, setNewZip] = useState('');
  const [newType, setNewType] = useState('Home');

  // Razorpay Overlay State
  const [razorpayOpen, setRazorpayOpen] = useState(false);
  const [razorpayMethod, setRazorpayMethod] = useState('card'); // 'card' | 'upi'
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Sizing details input state
  const [shoulderSize, setShoulderSize] = useState('16');
  const [chestSize, setChestSize] = useState('38');
  const [waistSize, setWaistSize] = useState('32');
  const [heightFit, setHeightFit] = useState('5.8');

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newZip) return;

    const newAddr = {
      id: `addr-${Date.now()}`,
      street: newStreet,
      city: newCity,
      state: newState,
      zip: newZip,
      type: newType,
      default: (user?.addresses || []).length === 0
    };

    const updatedAddresses = [...(user?.addresses || []), newAddr];
    await updateProfile({ addresses: updatedAddresses });
    
    setSelectedAddressId(newAddr.id);
    setNewAddressFormOpen(false);
    
    // Reset Form
    setNewStreet('');
    setNewCity('');
    setNewState('');
    setNewZip('');
  };

  const handlePayClick = () => {
    if (!selectedAddressId) {
      alert("Please select or add a delivery address first.");
      return;
    }
    setRazorpayOpen(true);
  };

  const processSimulatedPayment = () => {
    if (razorpayMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvv)) {
      setPaymentError('Please fill out card details.');
      return;
    }
    if (razorpayMethod === 'upi' && !upiId.includes('@')) {
      setPaymentError('Please enter a valid UPI ID (e.g. user@okhdfc).');
      return;
    }

    setPaymentError('');
    setPaymentProcessing(true);

    // Simulate Razorpay Gateway authorization process (approx 2s)
    setTimeout(async () => {
      setPaymentProcessing(false);
      setPaymentSuccess(true);
      
      // Save order in database
      const selectedAddress = user.addresses.find(a => a.id === selectedAddressId);
      
      // Since cart can support multiple items, we save them as one order or separate. Let's create an order for each item in the cart
      const orderPromises = cart.map(async (item) => {
        const orderData = {
          userId: user.uid,
          customerName: user.displayName,
          customerEmail: user.email,
          customerPhone: user.phone || "+91 99999 88888",
          productId: item.product.id,
          productTitle: item.product.title,
          productImage: item.product.images[0],
          storeId: item.product.storeId,
          storeName: item.product.storeName,
          size: item.size,
          color: item.color,
          rentalDays: item.rentalDays,
          startDate: item.startDate,
          endDate: item.endDate,
          rentalCost: item.rentalCost,
          securityDeposit: item.securityDeposit,
          sizingMeasurements: { shoulder: shoulderSize, chest: chestSize, waist: waistSize, height: heightFit },
          shippingAddress: selectedAddress,
          paymentId: `pay_razor_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          couponApplied: coupon || null,
          grandTotal: item.rentalCost + Math.round(item.rentalCost * 0.18) + item.securityDeposit + 250 // Individual proportional pricing
        };
        return await dbService.createOrder(orderData);
      });

      const createdOrders = await Promise.all(orderPromises);
      const firstOrderId = createdOrders[0]?.id || `ord-${Date.now()}`;

      // Complete order flow after 1s success visualization
      setTimeout(() => {
        setRazorpayOpen(false);
        clearCart();
        navigate(`/order-confirmation/${firstOrderId}`);
      }, 1000);

    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left animate-fade-in">
      
      <SeoHelper 
        title="Luxury Checkout"
        description="Provide your delivery address and sizing specs to complete your designer rental order securely."
      />

      <div className="border-b border-luxury-gold/20 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-luxury-charcoal dark:text-white">Secure Checkout</h1>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="dark:text-white">No items in checkout. Go back to cart.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: Address & Sizing measurements */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Address selector section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-luxury-gold/10 pb-3">
                <h3 className="text-sm font-bold tracking-wider uppercase flex items-center dark:text-white">
                  <MapPin size={16} className="text-luxury-gold mr-2" /> 1. Delivery Address
                </h3>
                <button
                  onClick={() => setNewAddressFormOpen(true)}
                  className="text-xs font-semibold text-luxury-gold hover:text-luxury-bronze flex items-center space-x-1"
                >
                  <Plus size={14} /> <span>Add New</span>
                </button>
              </div>

              {/* Saved Address Cards list */}
              {user?.addresses && user.addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-lg border transition-all cursor-pointer relative ${
                        selectedAddressId === addr.id
                          ? 'border-luxury-gold bg-luxury-cream/15 ring-1 ring-luxury-gold/20'
                          : 'border-luxury-gold/10 bg-white dark:bg-luxury-lightcharcoal hover:border-luxury-gold/30'
                      }`}
                    >
                      <span className="text-[10px] bg-luxury-gold/20 text-luxury-bronze px-2 py-0.5 rounded font-bold uppercase tracking-wider mb-2 inline-block">
                        {addr.type}
                      </span>
                      <p className="text-xs text-luxury-charcoal/80 dark:text-luxury-alabaster/80 leading-relaxed font-light">{addr.street}</p>
                      <p className="text-xs text-luxury-charcoal/80 dark:text-luxury-alabaster/80 leading-relaxed font-light">{addr.city}, {addr.state} - {addr.zip}</p>
                      
                      {selectedAddressId === addr.id && (
                        <div className="absolute top-4 right-4 text-luxury-gold font-bold text-xs">✓ Active</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-luxury-gold/20 rounded-lg">
                  <p className="text-xs text-luxury-charcoal/50 dark:text-luxury-alabaster/50">No saved addresses. Please add a shipping destination to continue.</p>
                </div>
              )}

              {/* Address Form Popup modal */}
              {newAddressFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                  <form onSubmit={handleAddAddress} className="w-full max-w-md bg-white dark:bg-luxury-charcoal border border-luxury-gold/25 p-6 rounded-xl space-y-4 shadow-2xl animate-fade-in-up">
                    <div className="flex items-center justify-between border-b border-luxury-gold/10 pb-3">
                      <h4 className="font-semibold text-sm uppercase text-luxury-gold tracking-widest">New Delivery Address</h4>
                      <button type="button" onClick={() => setNewAddressFormOpen(false)} className="text-luxury-charcoal dark:text-white">
                        <X size={16} />
                      </button>
                    </div>

                    <div className="space-y-1 text-left">
                      <span className="text-[9px] uppercase font-bold text-luxury-gold">Address Type</span>
                      <div className="flex space-x-2">
                        {['Home', 'Office', 'Hotel'].map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setNewType(t)}
                            className={`flex-1 py-1.5 text-xs font-semibold rounded border transition-all ${
                              newType === t 
                                ? 'bg-luxury-gold border-luxury-gold text-white' 
                                : 'border-luxury-gold/20 dark:text-white'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1 text-left">
                      <span className="text-[9px] uppercase font-bold text-luxury-gold">Street Details / Apartment No.</span>
                      <input
                        type="text"
                        required
                        value={newStreet}
                        onChange={(e) => setNewStreet(e.target.value)}
                        placeholder="Flat 102, Royal Gardens..."
                        className="w-full p-2 border border-luxury-gold/20 dark:text-white bg-transparent rounded text-xs focus:outline-none focus:border-luxury-gold"
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
                          placeholder="Mumbai"
                          className="w-full p-2 border border-luxury-gold/20 dark:text-white bg-transparent rounded text-xs focus:outline-none focus:border-luxury-gold"
                        />
                      </div>
                      <div className="space-y-1 text-left">
                        <span className="text-[9px] uppercase font-bold text-luxury-gold">State</span>
                        <input
                          type="text"
                          required
                          value={newState}
                          onChange={(e) => setNewState(e.target.value)}
                          placeholder="Maharashtra"
                          className="w-full p-2 border border-luxury-gold/20 dark:text-white bg-transparent rounded text-xs focus:outline-none focus:border-luxury-gold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 text-left">
                      <span className="text-[9px] uppercase font-bold text-luxury-gold">Pincode (6 digits)</span>
                      <input
                        type="text"
                        required
                        maxLength="6"
                        value={newZip}
                        onChange={(e) => setNewZip(e.target.value.replace(/\D/g, ''))}
                        placeholder="400049"
                        className="w-full p-2 border border-luxury-gold/20 dark:text-white bg-transparent rounded text-xs focus:outline-none focus:border-luxury-gold"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-luxury-gold text-white text-xs font-bold uppercase tracking-widest rounded-md hover:bg-luxury-bronze"
                    >
                      Save Address
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Fitting / Sizing Measurements */}
            <div className="space-y-4 bg-luxury-cream/15 dark:bg-luxury-lightcharcoal/45 p-6 rounded-xl border border-luxury-gold/15">
              <h3 className="text-sm font-bold tracking-wider uppercase border-b border-luxury-gold/10 pb-3 dark:text-white flex items-center">
                <Truck size={16} className="text-luxury-gold mr-2" /> 2. Temp Stitch-Fitting Details
              </h3>
              <p className="text-xs text-luxury-charcoal/50 dark:text-luxury-alabaster/50 font-light leading-relaxed">
                Our boutiques temporarily alter outfits using safe side-stitch overlays based on your details. These are non-destructive and fully adjustable.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-luxury-gold">Shoulder (inches)</span>
                  <input
                    type="number"
                    value={shoulderSize}
                    onChange={(e) => setShoulderSize(e.target.value)}
                    className="w-full p-2 border border-luxury-gold/20 dark:text-white bg-transparent rounded text-xs text-center"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-luxury-gold">Chest / Bust (inches)</span>
                  <input
                    type="number"
                    value={chestSize}
                    onChange={(e) => setChestSize(e.target.value)}
                    className="w-full p-2 border border-luxury-gold/20 dark:text-white bg-transparent rounded text-xs text-center"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-luxury-gold">Waist (inches)</span>
                  <input
                    type="number"
                    value={waistSize}
                    onChange={(e) => setWaistSize(e.target.value)}
                    className="w-full p-2 border border-luxury-gold/20 dark:text-white bg-transparent rounded text-xs text-center"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-luxury-gold">Height (feet)</span>
                  <input
                    type="text"
                    value={heightFit}
                    onChange={(e) => setHeightFit(e.target.value)}
                    className="w-full p-2 border border-luxury-gold/20 dark:text-white bg-transparent rounded text-xs text-center"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Summary and Pay Checkout triggers */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 rounded-xl p-6 shadow-md space-y-4">
              <h3 className="text-sm font-bold tracking-wider uppercase border-b border-luxury-gold/10 pb-3 dark:text-white">
                Booking Summary
              </h3>

              <div className="space-y-3.5 pb-4 border-b border-luxury-gold/10">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="flex justify-between items-center text-xs">
                    <div className="min-w-0 pr-4">
                      <p className="font-semibold text-luxury-charcoal dark:text-white truncate">{item.product.title}</p>
                      <p className="text-[9px] text-luxury-gold uppercase font-bold tracking-widest">{item.product.storeName} • {item.size}</p>
                    </div>
                    <span className="font-bold text-luxury-charcoal dark:text-white flex-shrink-0">₹{item.rentalCost.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 font-light border-b border-luxury-gold/10 pb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-luxury-charcoal dark:text-white">₹{subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST & Service Fees</span>
                  <span className="font-semibold text-luxury-charcoal dark:text-white">₹{(gstAmount + serviceFee).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-luxury-gold">
                  <span>Refundable Security Deposit</span>
                  <span className="font-bold">₹{totalSecurityDeposit.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] uppercase font-bold text-luxury-gold tracking-widest">Grand Total</p>
                  <p className="text-2xl font-bold text-luxury-charcoal dark:text-white">₹{grandTotal.toLocaleString()}</p>
                </div>
                <span className="text-[8px] border border-green-600 text-green-600 px-2 py-0.5 rounded uppercase font-bold tracking-widest">
                  Secure
                </span>
              </div>

              <button
                onClick={handlePayClick}
                className="w-full py-4 bg-luxury-gold text-white hover:bg-luxury-bronze transition-all text-center text-xs font-bold uppercase tracking-widest rounded shadow-xl flex items-center justify-center space-x-2"
              >
                <CreditCard size={14} />
                <span>Pay via Razorpay</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* RAZORPAY PAYMENT SIMULATION MODAL OVERLAY */}
      {razorpayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden relative text-left">
            
            {/* Header: Razorpay styling branding */}
            <div className="bg-[#0f172a] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[8px] bg-blue-500 text-white font-bold uppercase px-2 py-0.5 rounded tracking-widest mb-1.5 inline-block">Razorpay Trusted</span>
                <h4 className="text-base font-bold flex items-center">
                  Paridhan Marketplace
                </h4>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/50">Amount to pay</p>
                <p className="text-lg font-bold text-blue-400">₹{grandTotal.toLocaleString()}</p>
              </div>
              
              {!paymentProcessing && (
                <button
                  onClick={() => setRazorpayOpen(false)}
                  className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-full text-white/60 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              
              {paymentSuccess ? (
                /* Payment Success View */
                <div className="text-center py-6 space-y-4 animate-fade-in">
                  <CheckCircle2 size={56} className="mx-auto text-green-500" />
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">Payment Successful</h3>
                    <p className="text-xs text-slate-500 mt-1">Generating order confirmation, redirecting...</p>
                  </div>
                </div>
              ) : (
                /* Payment input details */
                <div className="space-y-4">
                  {paymentError && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded flex items-center text-xs text-red-600 font-semibold space-x-2">
                      <AlertCircle size={14} className="flex-shrink-0" />
                      <span>{paymentError}</span>
                    </div>
                  )}

                  {/* Payment method selector */}
                  <div className="flex border-b border-gray-200">
                    <button
                      onClick={() => setRazorpayMethod('card')}
                      className={`flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider text-center border-b-2 ${
                        razorpayMethod === 'card' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'
                      }`}
                    >
                      Credit/Debit Card
                    </button>
                    <button
                      onClick={() => setRazorpayMethod('upi')}
                      className={`flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider text-center border-b-2 ${
                        razorpayMethod === 'upi' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'
                      }`}
                    >
                      UPI / QR
                    </button>
                  </div>

                  {razorpayMethod === 'card' ? (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-bold text-slate-500">Card Number</span>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').substring(0, 16))}
                          placeholder="4321 0987 6543 2109"
                          disabled={paymentProcessing}
                          className="w-full p-2.5 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-bold text-slate-500">Expiry (MM/YY)</span>
                          <input
                            type="text"
                            required
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value.substring(0, 5))}
                            placeholder="12/28"
                            disabled={paymentProcessing}
                            className="w-full p-2.5 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-bold text-slate-500">CVV</span>
                          <input
                            type="password"
                            required
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                            placeholder="***"
                            disabled={paymentProcessing}
                            className="w-full p-2.5 border border-slate-200 rounded text-xs text-center text-slate-800 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-bold text-slate-500">VPA / UPI ID</span>
                        <input
                          type="text"
                          required
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@upi"
                          disabled={paymentProcessing}
                          className="w-full p-2.5 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>
                  )}

                  {/* Payment Button */}
                  <button
                    onClick={processSimulatedPayment}
                    disabled={paymentProcessing}
                    className="w-full py-3.5 bg-blue-600 text-white font-semibold text-xs uppercase tracking-wider rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    {paymentProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing payment...</span>
                      </>
                    ) : (
                      <span>Pay ₹{grandTotal.toLocaleString()}</span>
                    )}
                  </button>
                </div>
              )}

              <div className="flex items-center justify-center space-x-2 text-[9px] text-slate-400 font-light">
                <ShieldCheck size={12} className="text-blue-500" />
                <span>128-bit Encryption. Secured by Razorpay API sandbox.</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Checkout;
