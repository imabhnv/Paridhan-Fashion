import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Heart, HelpCircle } from 'lucide-react';
import SeoHelper from '../components/SeoHelper';

const About = () => {
  return (
    <div className="space-y-20 pb-20 text-left animate-fade-in">
      
      <SeoHelper 
        title="Our Story & Sustainability Mission" 
        description="Learn how Paridhan is building a circular luxury fashion economy in India, saving resources and empowering local boutiques." 
        keywords="sustainable fashion rent, circular fashion marketplace, rent Sabyasachi, dress rental eco friendly"
      />

      {/* Hero Header */}
      <section className="bg-luxury-cream/45 dark:bg-luxury-lightcharcoal/40 py-20 px-4 border-b border-luxury-gold/10">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold font-playfair tracking-tight text-luxury-charcoal dark:text-white">
            Redefining Luxury Fashion
          </h1>
          <p className="text-sm font-semibold tracking-widest text-luxury-gold uppercase">
            Sustainability • Accessibility • Handcrafted Heritage
          </p>
          <p className="text-base md:text-lg font-light text-luxury-charcoal/70 dark:text-luxury-alabaster/70 max-w-2xl mx-auto leading-relaxed pt-2">
            Paridhan is a next-generation fashion-tech startup platform empowering users to wear world-class designer couture for a fraction of the cost, keeping garments in circulation.
          </p>
        </div>
      </section>

      {/* Main content grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold dark:text-white">The Fashion Waste Problem</h2>
          <p className="text-sm font-light text-luxury-charcoal/70 dark:text-luxury-alabaster/70 leading-relaxed">
            The global fashion industry is responsible for nearly 10% of carbon emissions and massive water consumption. In India, heavy bridal lehengas, sherwanis, and formal tuxedos represent the peak of underutilized garments. 
          </p>
          <p className="text-sm font-light text-luxury-charcoal/70 dark:text-luxury-alabaster/70 leading-relaxed">
            A premium bridal outfit costing over ₹1,50,000 is typically worn for less than 8 hours total, sitting in storage boxes forever. This represents a massive waste of craftsmanship and material resources.
          </p>
          <div className="p-4 bg-luxury-gold/5 border border-luxury-gold/20 rounded-xl space-y-1">
            <span className="font-semibold text-xs text-luxury-gold uppercase block tracking-wider">Circular Economy Stat</span>
            <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 font-light">
              By sharing and renting a luxury outfit, we increase its utilization lifecycle by <strong>15x</strong>, reducing its lifetime environmental footprint by <strong>85%</strong>.
            </p>
          </div>
        </div>

        <div className="aspect-square bg-luxury-cream rounded-2xl overflow-hidden border border-luxury-gold/20 shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80" 
            alt="Sustainable Luxury Fashion" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Empowering local boutiques details */}
      <section className="bg-luxury-cream/25 dark:bg-luxury-lightcharcoal/20 py-16 border-y border-luxury-gold/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div className="order-2 md:order-1 aspect-square bg-luxury-cream rounded-2xl overflow-hidden border border-luxury-gold/20 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80" 
              alt="Luxury Boutique Showroom" 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-3xl font-bold dark:text-white">Empowering Local Designers</h2>
            <p className="text-sm font-light text-luxury-charcoal/70 dark:text-luxury-alabaster/70 leading-relaxed">
              We do not compete with boutiques; we empower them. Our platform connects showrooms, designers, and boutiques directly with a national network of fashion lovers. 
            </p>
            <p className="text-sm font-light text-luxury-charcoal/70 dark:text-luxury-alabaster/70 leading-relaxed">
              Boutiques register on Paridhan to upload their archival, unused premium inventory, turning depreciating capital into a consistent recurring revenue stream. We manage the delivery, sizing coordination, and security deposit audits.
            </p>
          </div>

        </div>
      </section>

      {/* Core values cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold tracking-tight">Our Core Pillars</h2>
          <div className="h-0.5 w-16 bg-luxury-gold mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-6 bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 rounded-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-luxury-gold/10 text-luxury-gold flex items-center justify-center mx-auto">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-semibold text-base dark:text-white">Impeccable Hygiene</h3>
            <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 font-light leading-relaxed">
              We enforce dry-cleaning and UV-C sanitization SLA checks on every single dress, guaranteeing sanitization standard excellence.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 rounded-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-luxury-gold/10 text-luxury-gold flex items-center justify-center mx-auto">
              <Award size={24} />
            </div>
            <h3 className="font-semibold text-base dark:text-white">Authentic Couture</h3>
            <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 font-light leading-relaxed">
              We partner exclusively with verified boutiques, ensuring original, high-quality, and authentic designer work.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/15 rounded-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-luxury-gold/10 text-luxury-gold flex items-center justify-center mx-auto">
              <Heart size={24} />
            </div>
            <h3 className="font-semibold text-base dark:text-white">Circular Future</h3>
            <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 font-light leading-relaxed">
              Redefining our relationship with wardrobe ownership. Wear luxury, support the circular economy, and live sustainably.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default About;
