import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Download, Calendar, ShieldCheck, MapPin, Printer } from 'lucide-react';
import dbService from '../services/db';
import SeoHelper from '../components/SeoHelper';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      const orders = await dbService.getOrders();
      const match = orders.find(o => o.id === id);
      if (match) {
        setOrder(match);
      }
      setLoading(false);
    };
    fetchOrderDetails();
  }, [id]);

  const handlePrint = () => {
    window.print();
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
        <h2 className="text-xl font-bold dark:text-white">Order record not found</h2>
        <Link to="/" className="inline-block px-5 py-2 bg-luxury-gold text-white text-xs font-bold uppercase tracking-widest rounded">
          Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 text-left animate-fade-in print:bg-white print:text-black">
      
      <SeoHelper title="Order Reserved" description="Your rental order is confirmed." />

      {/* Success banner (hide in print) */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center space-y-4 print:hidden">
        <CheckCircle size={48} className="mx-auto text-green-600 dark:text-green-400" />
        <div>
          <h2 className="text-2xl font-bold dark:text-white">Reservation Locked!</h2>
          <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 mt-1">
            Order Reference: <strong className="text-luxury-charcoal dark:text-white">{order.id}</strong>
          </p>
        </div>
        <div className="flex justify-center space-x-3 pt-2">
          <Link
            to={`/tracking/${order.id}`}
            className="px-6 py-2.5 bg-luxury-charcoal text-white hover:bg-luxury-gold text-xs font-bold uppercase tracking-widest rounded transition-colors"
          >
            Track Shipping
          </Link>
          <button
            onClick={handlePrint}
            className="px-6 py-2.5 border border-luxury-gold text-luxury-gold hover:bg-luxury-cream text-xs font-bold uppercase tracking-widest rounded transition-colors flex items-center"
          >
            <Printer size={12} className="mr-1.5" /> Print Invoice
          </button>
        </div>
      </div>

      {/* INVOICE CONTAINER */}
      <div className="bg-white dark:bg-luxury-lightcharcoal rounded-xl border border-luxury-gold/15 p-8 shadow-md space-y-6 print:border-none print:shadow-none">
        
        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b border-luxury-gold/15 pb-6">
          <div>
            <h1 className="text-xl font-bold tracking-widest font-playfair dark:text-white">PARIDHAN INVOICE</h1>
            <p className="text-[10px] text-luxury-charcoal/45 dark:text-luxury-alabaster/45 mt-1">Invoice Ref: {order.paymentId}</p>
          </div>
          <div className="text-right">
            <span className="text-[9px] bg-green-500/15 text-green-600 px-3 py-1 rounded font-bold uppercase tracking-wider">
              Paid via Razorpay
            </span>
            <p className="text-[10px] text-luxury-charcoal/50 dark:text-luxury-alabaster/50 mt-1.5">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Client & Store Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed font-light text-luxury-charcoal/70 dark:text-luxury-alabaster/70 border-b border-luxury-gold/10 pb-6">
          <div>
            <span className="text-[9px] uppercase font-bold text-luxury-gold block mb-1">Delivered to Client</span>
            <strong className="text-luxury-charcoal dark:text-white font-semibold">{order.customerName}</strong>
            <p>{order.customerPhone}</p>
            <p className="mt-1">{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zip}</p>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-luxury-gold block mb-1">Supplied by Atelier</span>
            <strong className="text-luxury-charcoal dark:text-white font-semibold">{order.storeName}</strong>
            <p>Sanitized Outfit Rental Services</p>
            <p className="mt-1">Level 2, High Street Galleria, Mumbai</p>
          </div>
        </div>

        {/* Rental Parameters */}
        <div className="bg-luxury-cream/20 dark:bg-luxury-charcoal/50 p-4 rounded-lg flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2.5">
            <Calendar size={16} className="text-luxury-gold" />
            <div>
              <span className="text-[9px] uppercase font-bold text-luxury-gold block">Rental Schedule ({order.rentalDays} Days)</span>
              <span className="dark:text-white font-medium">{order.startDate} to {order.endDate}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase font-bold text-luxury-gold block">Security Deposit (Refundable)</span>
            <span className="dark:text-white font-semibold">₹{order.securityDeposit.toLocaleString()}</span>
          </div>
        </div>

        {/* Item details */}
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-luxury-gold/10 pb-2 text-[10px] uppercase font-bold text-luxury-gold">
              <th className="py-2">Outfit Description</th>
              <th className="py-2 text-center">Size / Fitting</th>
              <th className="py-2 text-right">Rental Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-luxury-gold/5">
              <td className="py-4 flex items-center space-x-3">
                <img src={order.productImage} alt="" className="w-10 h-14 object-cover rounded" />
                <div>
                  <strong className="text-luxury-charcoal dark:text-white font-semibold block">{order.productTitle}</strong>
                  <span className="text-[10px] text-luxury-charcoal/40 dark:text-luxury-alabaster/40 font-light">{order.storeName}</span>
                </div>
              </td>
              <td className="py-4 text-center dark:text-white font-medium">
                {order.size} (Stitch fit: S-{order.sizingMeasurements.shoulder}" C-{order.sizingMeasurements.chest}" W-{order.sizingMeasurements.waist}")
              </td>
              <td className="py-4 text-right dark:text-white font-bold">
                ₹{order.rentalCost.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Totals Box */}
        <div className="flex justify-end pt-4">
          <div className="w-full max-w-xs space-y-2.5 text-xs text-luxury-charcoal/70 dark:text-luxury-alabaster/70 font-light">
            <div className="flex justify-between">
              <span>Rental Charge</span>
              <span className="font-semibold text-luxury-charcoal dark:text-white">₹{order.rentalCost.toLocaleString()}</span>
            </div>
            
            {order.couponApplied && (
              <div className="flex justify-between text-green-600">
                <span>Coupon Applied ({order.couponApplied})</span>
                <span>-10%</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Luxury Services GST (18%)</span>
              <span className="font-semibold text-luxury-charcoal dark:text-white">₹{Math.round(order.rentalCost * 0.18).toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Logistics & Sanitization Handling</span>
              <span className="font-semibold text-luxury-charcoal dark:text-white">₹250</span>
            </div>

            <div className="flex justify-between border-t border-dashed border-luxury-gold/10 pt-2 text-luxury-gold font-medium">
              <span>Security Deposit Locked</span>
              <span>₹{order.securityDeposit.toLocaleString()}</span>
            </div>

            <div className="flex justify-between border-t border-luxury-gold/20 pt-3 text-sm font-bold text-luxury-charcoal dark:text-white">
              <span>Grand Total Paid</span>
              <span>₹{order.grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer info print */}
        <div className="border-t border-luxury-gold/10 pt-6 flex items-center justify-between text-[10px] text-luxury-charcoal/40 dark:text-luxury-alabaster/40 font-light">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck size={14} className="text-luxury-gold" />
            <span>Fully insured under Paridhan Safe-wear.</span>
          </div>
          <span>Support: concierge@paridhan.com | +91 22 4900 8800</span>
        </div>

      </div>

    </div>
  );
};

export default OrderConfirmation;
