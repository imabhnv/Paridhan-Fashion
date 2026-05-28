import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Truck, Calendar, CheckCircle2, ShieldCheck, Clock, MapPin, ChevronRight, ArrowLeft, RefreshCw 
} from 'lucide-react';
import dbService from '../services/db';
import SeoHelper from '../components/SeoHelper';

const Tracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Return pickup scheduler state
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('10:00 AM - 01:00 PM');
  const [courier, setCourier] = useState('Delhivery Express');
  const [pickupScheduled, setPickupScheduled] = useState(false);

  const fetchOrderDetails = async () => {
    const orders = await dbService.getOrders();
    const match = orders.find(o => o.id === id);
    if (match) {
      setOrder(match);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const handleSchedulePickup = async (e) => {
    e.preventDefault();
    if (!pickupDate) return;

    // Update order status in DB to "Return Pending"
    const success = await dbService.updateOrder(order.id, {
      status: "Return Pending",
      returnPickupDetails: {
        date: pickupDate,
        time: pickupTime,
        courier
      }
    });

    if (success) {
      setPickupScheduled(true);
      // Reload order details
      await fetchOrderDetails();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-alabaster dark:bg-luxury-charcoal">
        <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold dark:text-white">Order not found</h2>
        <Link to="/" className="inline-block px-5 py-2 bg-luxury-gold text-white text-xs font-bold uppercase tracking-widest rounded">
          Back Home
        </Link>
      </div>
    );
  }

  // Predefine order status steps in sequence
  const STATUS_STEPS = ["Confirmed", "Out for Delivery", "Delivered", "Return Pending", "Cleaning", "Available Again"];
  const currentStepIdx = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-left animate-fade-in">
      
      <SeoHelper title={`Track Order ${order.id}`} description="Monitor your luxury outfit rental logistics and schedule returns." />

      <div>
        <Link to="/dashboard/customer" className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-luxury-gold hover:text-luxury-bronze">
          <ArrowLeft size={14} className="mr-1.5" /> Back to Dashboard
        </Link>
      </div>

      <div className="border-b border-luxury-gold/20 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-luxury-charcoal dark:text-white">Logistics & Tracking</h1>
          <p className="text-xs text-luxury-charcoal/50 dark:text-luxury-alabaster/50 mt-1">Order Ref: {order.id}</p>
        </div>
        <div className="bg-luxury-gold/15 border border-luxury-gold/30 px-3 py-1.5 rounded-full text-xs font-semibold text-luxury-gold uppercase tracking-wider flex items-center">
          <Clock size={12} className="mr-1.5" /> Current Status: {order.status}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Visual Tracking Timeline */}
        <div className="lg:col-span-8 bg-white dark:bg-luxury-lightcharcoal rounded-xl border border-luxury-gold/15 p-6 shadow-md space-y-8">
          <h2 className="text-base font-bold tracking-wider uppercase border-b border-luxury-gold/10 pb-3 dark:text-white">
            Delivery Timeline
          </h2>

          {/* Timeline track */}
          <div className="relative pl-8 space-y-8">
            <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-luxury-gold/15"></div>

            {order.timeline?.map((step, idx) => {
              const isActive = step.status === order.status;
              return (
                <div key={idx} className="relative flex items-start space-x-4 group">
                  
                  {/* Circle Indicator */}
                  <div className={`absolute -left-7.5 w-6.5 h-6.5 rounded-full flex items-center justify-center border transition-all ${
                    isActive 
                      ? 'bg-luxury-gold border-luxury-gold text-white scale-110 shadow-lg' 
                      : 'bg-luxury-cream border-luxury-gold/30 text-luxury-gold'
                  }`}>
                    <CheckCircle2 size={12} fill={isActive ? "none" : "currentColor"} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                      <h4 className={`font-semibold text-sm ${isActive ? 'text-luxury-gold font-bold' : 'text-luxury-charcoal dark:text-white'}`}>
                        {step.label}
                      </h4>
                      <span className="text-[10px] text-luxury-charcoal/40 dark:text-luxury-alabaster/40 font-light">
                        {new Date(step.date).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 font-light leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Sizing measurements overview */}
          <div className="pt-6 border-t border-luxury-gold/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-light">
            <div>
              <span className="text-[9px] uppercase font-bold text-luxury-gold block">Measurement Size</span>
              <p className="font-semibold text-luxury-charcoal dark:text-white">{order.size} Standard</p>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-luxury-gold block">Stitch Shoulders</span>
              <p className="font-semibold text-luxury-charcoal dark:text-white">{order.sizingMeasurements?.shoulder || 16}"</p>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-luxury-gold block">Stitch Chest</span>
              <p className="font-semibold text-luxury-charcoal dark:text-white">{order.sizingMeasurements?.chest || 38}"</p>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-luxury-gold block">Stitch Waist</span>
              <p className="font-semibold text-luxury-charcoal dark:text-white">{order.sizingMeasurements?.waist || 32}"</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Return scheduler / Outfit details */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Order Details Brief Card */}
          <div className="bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold tracking-wider uppercase border-b border-luxury-gold/10 pb-2 dark:text-white">
              Outfit Details
            </h3>
            <div className="flex items-center space-x-3">
              <img src={order.productImage} alt="" className="w-12 h-16 object-cover rounded bg-luxury-cream" />
              <div className="text-left min-w-0">
                <p className="text-[9px] text-luxury-gold font-bold uppercase tracking-widest">{order.storeName}</p>
                <h4 className="font-semibold text-xs truncate dark:text-white">{order.productTitle}</h4>
                <p className="text-[10px] text-luxury-charcoal/50 dark:text-luxury-alabaster/50 mt-1">Rental: {order.startDate} to {order.endDate}</p>
              </div>
            </div>
          </div>

          {/* RETURN PICKUP SCHEDULER WIDGET */}
          {(order.status === "Delivered" || order.status === "Return Pending") && (
            <div className="bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/20 rounded-xl p-6 shadow-md space-y-4">
              <h3 className="text-sm font-bold tracking-wider uppercase border-b border-luxury-gold/10 pb-3 dark:text-white flex items-center">
                <RefreshCw size={14} className="text-luxury-gold mr-2 animate-spin-slow" /> Schedule Return Pickup
              </h3>
              
              {order.status === "Return Pending" && order.returnPickupDetails ? (
                <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 rounded-md text-xs space-y-1.5">
                  <p className="font-bold flex items-center">
                    <CheckCircle2 size={12} className="mr-1.5" /> Return Courier Booked
                  </p>
                  <p className="font-light">Pickup Date: <strong className="font-semibold">{order.returnPickupDetails.date}</strong></p>
                  <p className="font-light">Time Slot: <strong className="font-semibold">{order.returnPickupDetails.time}</strong></p>
                  <p className="font-light">Courier: <strong className="font-semibold">{order.returnPickupDetails.courier}</strong></p>
                </div>
              ) : (
                <form onSubmit={handleSchedulePickup} className="space-y-4 text-xs font-light text-luxury-charcoal/70 dark:text-luxury-alabaster/70">
                  <p className="leading-relaxed">
                    Choose a preferred time slot for return pickup. Our courier partner will visit your shipping address with the return validation package.
                  </p>
                  
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-luxury-gold block">1. Pickup Date</span>
                    <input
                      type="date"
                      required
                      min={order.startDate}
                      max={order.endDate}
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full p-2 border border-luxury-gold/20 bg-transparent dark:text-white rounded text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-luxury-gold block">2. Preferred Time Window</span>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full p-2 border border-luxury-gold/20 bg-transparent dark:text-white rounded text-xs focus:outline-none"
                    >
                      <option value="10:00 AM - 01:00 PM">10:00 AM - 01:00 PM</option>
                      <option value="01:00 PM - 04:00 PM">01:00 PM - 04:00 PM</option>
                      <option value="04:00 PM - 07:00 PM">04:00 PM - 07:00 PM</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-luxury-gold block">3. Courier Partner</span>
                    <select
                      value={courier}
                      onChange={(e) => setCourier(e.target.value)}
                      className="w-full p-2 border border-luxury-gold/20 bg-transparent dark:text-white rounded text-xs focus:outline-none"
                    >
                      <option value="Delhivery Express">Delhivery Express</option>
                      <option value="Blue Dart Prime">Blue Dart Prime</option>
                      <option value="Shadowfax Logistics">Shadowfax Logistics</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-luxury-gold text-white hover:bg-luxury-bronze transition-colors text-center text-xs font-bold uppercase tracking-widest rounded"
                  >
                    Schedule Pickup
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Refund Deposit Reminder Card */}
          <div className="p-4 bg-luxury-gold/5 border border-luxury-gold/20 rounded-xl space-y-1.5 text-xs text-left">
            <span className="font-semibold text-luxury-gold flex items-center">
              <ShieldCheck size={14} className="mr-1.5" /> Refund Deposit Notice
            </span>
            <p className="text-[11px] text-luxury-charcoal/60 dark:text-luxury-alabaster/60 font-light leading-relaxed">
              Once courier receives the item and boutique verifies the sanitization checks (SLA within 24 hours of receipt), the deposit of <strong>₹{order.securityDeposit.toLocaleString()}</strong> is automatically refunded to your original payment card.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Tracking;
