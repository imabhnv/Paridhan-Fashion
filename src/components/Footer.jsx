import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-luxury-charcoal text-luxury-cream border-t border-luxury-gold/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top: Newsletter Subscription & Brand Pitch */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-1 space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-3xl font-bold tracking-widest font-playfair text-white">
                PARIDHAN
              </span>
              <span className="h-2 w-2 rounded-full bg-luxury-gold inline-block"></span>
            </Link>
            <p className="text-sm text-luxury-cream/70 font-light leading-relaxed max-w-md">
              India's premier luxury designer rental marketplace. Wear high-fashion couture for a fraction of the cost, while enabling a circular, sustainable future for fashion.
            </p>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold tracking-wider text-white uppercase">Subscribe to the Salon</h3>
            <p className="text-sm text-luxury-cream/65 font-light">
              Receive notifications on exclusive collection drops, seasonal edits, and styling advice.
            </p>
            <form onSubmit={handleSubscribe} className="flex max-w-md">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 bg-white/5 border border-luxury-gold/30 text-white rounded-l-md focus:outline-none focus:border-luxury-gold text-sm font-light tracking-wide transition-all"
              />
              <button
                type="submit"
                className="px-6 bg-luxury-gold hover:bg-luxury-bronze text-white font-medium rounded-r-md transition-all flex items-center justify-center"
              >
                {subscribed ? "Joined" : <Send size={18} />}
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-luxury-gold font-medium tracking-wide animate-fade-in">
                Thank you! You have been subscribed to our luxury mailing list.
              </p>
            )}
          </div>
        </div>

        {/* Middle: Links Sitemaps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase">Paridhan</h4>
            <ul className="space-y-2.5 text-sm font-light text-luxury-cream/70">
              <li><Link to="/about" className="hover:text-luxury-gold transition-colors">Our Story & Sustainability</Link></li>
              <li><Link to="/contact" className="hover:text-luxury-gold transition-colors">Contact Support</Link></li>
              <li><Link to="/auth?role=store" className="hover:text-luxury-gold transition-colors">List Your Boutique</Link></li>
              <li><Link to="/trust" className="hover:text-luxury-gold transition-colors">Sanitization Standards</Link></li>
            </ul>
          </div>

          {/* Trust Policies */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase">Trust & Policies</h4>
            <ul className="space-y-2.5 text-sm font-light text-luxury-cream/70">
              <li><Link to="/trust/rental-policy" className="hover:text-luxury-gold transition-colors">Rental Agreement</Link></li>
              <li><Link to="/trust/damage-protection" className="hover:text-luxury-gold transition-colors">Damage Protection Policy</Link></li>
              <li><Link to="/trust/refund-policy" className="hover:text-luxury-gold transition-colors">Refund & Cancellation</Link></li>
              <li><Link to="/trust/terms" className="hover:text-luxury-gold transition-colors">Terms of Service</Link></li>
              <li><Link to="/trust/privacy" className="hover:text-luxury-gold transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          {/* Founders Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase">The Founders</h4>
            <div className="space-y-3 text-sm font-light text-luxury-cream/70 leading-relaxed">
              <p>
                Founded and led by <span className="text-luxury-gold font-medium">Tanya Gupta</span> with <span className="text-luxury-gold font-medium">Abhinav Varshney</span> driving Paridhan’s vision, strategy, and long-term growth, we are building a future where luxury fashion is accessible, sustainable, and within reach.
              </p>
              <ul className="space-y-3 pt-2 border-t border-luxury-gold/10">
                <li className="flex items-center space-x-2.5">
                  <Mail size={16} className="text-luxury-gold" />
                  <span>imabhnv@gmail.com</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Mail size={16} className="text-luxury-gold" />
                  <span>guptatanya245@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom: Socials, sanitization badge, payments and copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 text-xs font-light text-luxury-cream/50">
          
          <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
            <ShieldCheck size={14} className="text-luxury-gold" />
            <span className="text-[10px] tracking-widest uppercase font-medium text-luxury-gold">100% UV Sanitized & Inspected</span>
          </div>

          <div>
            &copy; {new Date().getFullYear()} Paridhan Marketplace. Crafted with Luxury. All Rights Reserved.
          </div>

          {/* Payments and Socials */}
          <div className="flex flex-col sm:flex-row items-center sm:space-x-8 space-y-4 sm:space-y-0">
            {/* Socials */}
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            </div>
            {/* Payment logos mock */}
            <div className="flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-md border border-white/5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Secured via</span>
              <span className="font-extrabold tracking-tight text-white/80">Razorpay</span>
              <span className="text-white/60">|</span>
              <span className="font-bold tracking-widest text-white/50 text-[10px]">UPI</span>
              <span className="text-white/60">|</span>
              <span className="font-semibold text-white/80">VISA</span>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;