import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, HelpCircle, ArrowRight } from 'lucide-react';
import SeoHelper from '../components/SeoHelper';
import dbService from '../services/db';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await dbService.submitContactRequest({
        name,
        email,
        message,
        type: 'General Inquiry'
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error("Failed to submit contact request", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 text-left animate-fade-in">
      
      <SeoHelper 
        title="Contact Concierge Support" 
        description="Get in touch with Paridhan luxury concierge. Email, call, or file inquiries about wedding bookings and dress listings."
      />

      <div className="border-b border-luxury-gold/20 pb-6">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-luxury-charcoal dark:text-white">
          Contact Concierge
        </h1>
        <p className="text-sm font-light text-luxury-charcoal/50 dark:text-luxury-alabaster/50 mt-2">
          Our customer support representatives and boutique concierge desks are available 7 days a week.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: Contact Form */}
        <div className="lg:col-span-7 bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 p-8 rounded-xl shadow-md space-y-6">
          <h3 className="text-base font-bold uppercase tracking-widest text-luxury-gold border-b border-luxury-gold/10 pb-3">
            Send support request
          </h3>

          {success && (
            <div className="p-3.5 bg-green-500/10 border border-green-500/30 text-green-600 rounded text-xs font-semibold">
              ✅ Thank you! Your support request has been logged. Our concierge will get back to you shortly.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-light text-luxury-charcoal/70 dark:text-luxury-alabaster/70">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 text-left">
                <span className="text-[9px] uppercase font-bold text-luxury-gold">Your Name</span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-transparent border border-luxury-gold/25 dark:text-white rounded focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div className="space-y-1 text-left">
                <span className="text-[9px] uppercase font-bold text-luxury-gold">Email Address</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-transparent border border-luxury-gold/25 dark:text-white rounded focus:outline-none focus:border-luxury-gold"
                />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <span className="text-[9px] uppercase font-bold text-luxury-gold">Message Inquiries</span>
              <textarea
                required
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we assist you with fits, deposits, or listing details?"
                className="w-full p-2.5 bg-transparent border border-luxury-gold/25 dark:text-white rounded focus:outline-none focus:border-luxury-gold"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 bg-luxury-gold text-white font-bold uppercase tracking-widest text-[10px] rounded hover:bg-luxury-bronze transition-all flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Logging...</span>
                </>
              ) : (
                <>
                  <Send size={12} />
                  <span>Send Message</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* RIGHT COLUMN: Coordinates & FAQ highlight */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Coordinates */}
          <div className="bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 p-6 rounded-xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-luxury-gold border-b border-luxury-gold/10 pb-2.5">
              Office Contacts
            </h3>

            <ul className="space-y-4 text-xs font-light text-luxury-charcoal/70 dark:text-luxury-alabaster/70">
              <li className="flex items-start space-x-3">
                <Phone size={16} className="text-luxury-gold flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block text-luxury-charcoal dark:text-white">Phone Enquiries</strong>
                  +91-9758346524, +91-7078363826
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={16} className="text-luxury-gold flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block text-luxury-charcoal dark:text-white">Email Desk</strong>
                  imabhnv@gmail.com, guptatanya245@gmail.com
                </div>
              </li>
            </ul>
          </div>



        </div>

      </div>

    </div>
  );
};

export default Contact;
