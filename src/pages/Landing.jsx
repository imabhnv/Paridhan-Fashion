import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ShieldAlert, Award, Calendar, Heart, ShieldCheck, CheckCircle2, ChevronRight, HelpCircle
} from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_BOUTIQUES, MOCK_TESTIMONIALS, MOCK_FAQS } from '../data/mockData';
import SeoHelper from '../components/SeoHelper';
import dbService from '../services/db';

const Landing = () => {
  // Fetch boutiques dynamically from the database
  const [featuredBoutiques, setFeaturedBoutiques] = React.useState([]);

  React.useEffect(() => {
    const loadVerifiedBoutiques = async () => {
      const boutiques = await dbService.getVerifiedBoutiques();
      // Show up to 3 verified boutiques
      setFeaturedBoutiques(boutiques.slice(0, 3));
    };
    loadVerifiedBoutiques();
  }, []);

  // FAQ state
  const [openFaqIdx, setOpenFaqIdx] = React.useState(null);

  const toggleFaq = (idx) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  const categories = [
    { name: "Bridal Wear", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&h=500&q=80", count: "120+ Outfits" },
    { name: "Designer Lehengas", img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&h=500&q=80", count: "240+ Outfits" },
    { name: "Party Wear", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&h=500&q=80", count: "310+ Outfits" },
    { name: "Ethnic Wear", img: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=400&h=500&q=80", count: "190+ Outfits" },
    { name: "Tuxedos", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&h=500&q=80", count: "80+ Suits" },
    { name: "Luxury Gowns", img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=400&h=500&q=80", count: "140+ Gowns" }
  ];

  return (
    <div className="space-y-24 pb-20 overflow-x-hidden">
      
      {/* Dynamic SEO Meta Header */}
      <SeoHelper 
        title="Wear Luxury. Pay Less."
        description="Rent premium designer lehengas, bridal wear, sherwanis, and tuxedos from India's top boutiques. 5-stage sanitization, custom sizing, and secure payments."
        keywords="luxury fashion rental, designer lehenga on rent, rent sherwani, wedding lehenga rental, Sabyasachi lehenga rental, Manish Malhotra rent"
        schemaMarkup={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Paridhan",
          "url": "https://paridhan-rental.web.app",
          "description": "Premium luxury designer outfit rental marketplace",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://paridhan-rental.web.app/catalog?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-luxury-cream/35 dark:bg-luxury-charcoal/10 py-16 px-4">
        
        {/* Soft floating background gradients */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-luxury-gold/10 dark:bg-luxury-gold/5 filter blur-3xl"></div>
          <div className="absolute top-1/2 right-10 w-80 h-80 rounded-full bg-luxury-gold/15 dark:bg-luxury-gold/5 filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
          
          {/* Hero Left Content */}
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
            className="lg:col-span-7 space-y-8 text-left"
          >
            
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="inline-flex items-center space-x-2 bg-luxury-gold/15 border border-luxury-gold/30 px-3.5 py-1.5 rounded-full">
              <Sparkles size={14} className="text-luxury-gold" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-luxury-gold">
                The Circular Luxury Revolution
              </span>
            </motion.div>

            <motion.h1 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="text-5xl md:text-7xl font-semibold tracking-tight leading-none text-luxury-charcoal dark:text-white">
              Wear Luxury.<br />
              <span className="text-gold-gradient font-bold italic font-playfair">Pay Less.</span>
            </motion.h1>

            <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="text-lg md:text-xl font-light text-luxury-charcoal/70 dark:text-luxury-alabaster/70 max-w-xl leading-relaxed">
              Rent premium designer couture for weddings, sangeets, cocktail parties, and festivals at just 3% to 5% of the retail price.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-2">
              <Link
                to="/catalog"
                className="px-8 py-4 bg-luxury-charcoal text-white dark:bg-luxury-gold dark:text-luxury-charcoal font-bold tracking-widest text-center uppercase text-xs rounded-md shadow-2xl hover:bg-luxury-gold dark:hover:bg-luxury-cream transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Browse Catalog
              </Link>
              <Link
                to="/auth?role=store"
                className="px-8 py-4 border border-luxury-charcoal/30 dark:border-luxury-gold/30 hover:border-luxury-gold text-luxury-charcoal dark:text-luxury-alabaster hover:text-luxury-gold font-bold tracking-widest text-center uppercase text-xs rounded-md transition-all duration-300"
              >
                List Your Boutique
              </Link>
            </motion.div>

            {/* Micro Trust Stats */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="grid grid-cols-3 gap-6 pt-6 border-t border-luxury-gold/20 max-w-lg">
              <div>
                <p className="text-2xl font-semibold text-luxury-gold">100%</p>
                <p className="text-[10px] uppercase tracking-wider text-luxury-charcoal/50 dark:text-luxury-alabaster/50">Sanitized & Safe</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-luxury-gold">15+</p>
                <p className="text-[10px] uppercase tracking-wider text-luxury-charcoal/50 dark:text-luxury-alabaster/50">Elite Designers</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-luxury-gold">48hr</p>
                <p className="text-[10px] uppercase tracking-wider text-luxury-charcoal/50 dark:text-luxury-alabaster/50">Deposit Refund</p>
              </div>
            </motion.div>

          </motion.div>

          {/* Hero Right Visuals (Floating Cards Mock) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="lg:col-span-5 relative flex justify-center lg:justify-end"
          >
            <div className="relative w-80 h-[480px]">
              
              {/* Card 1: Sabyasachi Lehenga */}
              <div className="absolute top-0 left-0 w-64 h-80 rounded-2xl overflow-hidden border border-luxury-gold/30 shadow-2xl z-20 transform -rotate-6 transition-all duration-300 hover:rotate-0 hover:scale-105 cursor-pointer bg-white">
                <img 
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&h=500&q=80" 
                  alt="Sabyasachi Lehenga" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                  <p className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Sabyasachi Heritage</p>
                  <p className="text-xs font-semibold">Crimson Royal Lehenga</p>
                </div>
              </div>

              {/* Card 2: Tuxedo */}
              <div className="absolute bottom-0 right-0 w-56 h-72 rounded-2xl overflow-hidden border border-luxury-gold/25 shadow-2xl z-10 transform rotate-12 transition-all duration-300 hover:rotate-0 hover:scale-105 cursor-pointer bg-white">
                <img 
                  src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&h=500&q=80" 
                  alt="Raymond Tux" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                  <p className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Raymond Custom</p>
                  <p className="text-xs font-semibold">Peak Lapel Tuxedo</p>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. FEATURED CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Browse Luxury Silhouettes</h2>
          <p className="text-sm font-light text-luxury-charcoal/70 dark:text-luxury-alabaster/70">
            Select a curated category matching your event's dress code and personal style.
          </p>
          <div className="h-0.5 w-16 bg-luxury-gold mx-auto"></div>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {categories.map((cat, idx) => (
            <motion.div key={idx} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className="h-full">
              <Link 
                to={`/catalog?category=${encodeURIComponent(cat.name)}`}
                className="group relative h-72 rounded-xl overflow-hidden shadow-lg border border-luxury-gold/10 hover:border-luxury-gold/40 flex items-end p-4 transition-all duration-300 block w-full"
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/35 z-10 transition-all"></div>
                <img 
                  src={cat.img} 
                  alt={cat.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="relative z-20 text-left text-white w-full space-y-0.5">
                  <h3 className="text-sm font-semibold tracking-wide truncate group-hover:text-luxury-gold transition-colors">{cat.name}</h3>
                  <p className="text-[9px] text-white/70 uppercase tracking-widest font-light">{cat.count}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="bg-luxury-cream/45 dark:bg-luxury-lightcharcoal/40 py-20 border-y border-luxury-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">The 4-Step Rental Experience</h2>
            <p className="text-sm font-light text-luxury-charcoal/70 dark:text-luxury-alabaster/70">
              Renting premium fashion is streamlined, secure, and tailored to you.
            </p>
            <div className="h-0.5 w-16 bg-luxury-gold mx-auto"></div>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8 relative"
          >
            
            {/* Step 1 */}
            <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className="bg-white dark:bg-luxury-charcoal p-6 rounded-xl border border-luxury-gold/15 shadow-md space-y-4 text-center group hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-full bg-luxury-gold/10 text-luxury-gold font-bold flex items-center justify-center mx-auto text-lg group-hover:bg-luxury-gold group-hover:text-white transition-all">
                1
              </div>
              <h3 className="font-semibold text-base">Select Outfit</h3>
              <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 leading-relaxed font-light">
                Browse our premium designer catalog and filter by size, color, design, and dates.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className="bg-white dark:bg-luxury-charcoal p-6 rounded-xl border border-luxury-gold/15 shadow-md space-y-4 text-center group hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-full bg-luxury-gold/10 text-luxury-gold font-bold flex items-center justify-center mx-auto text-lg group-hover:bg-luxury-gold group-hover:text-white transition-all">
                2
              </div>
              <h3 className="font-semibold text-base">Reserve & Pay</h3>
              <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 leading-relaxed font-light">
                Choose a 3, 5, or 7 day booking window. Make a secure, deposit-inclusive payment.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className="bg-white dark:bg-luxury-charcoal p-6 rounded-xl border border-luxury-gold/15 shadow-md space-y-4 text-center group hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-full bg-luxury-gold/10 text-luxury-gold font-bold flex items-center justify-center mx-auto text-lg group-hover:bg-luxury-gold group-hover:text-white transition-all">
                3
              </div>
              <h3 className="font-semibold text-base">Flaunt It</h3>
              <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 leading-relaxed font-light">
                Receive the custom-fitted, UV-sanitized outfit in a luxury bag. Rock your special event!
              </p>
            </motion.div>

            {/* Step 4 */}
            <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className="bg-white dark:bg-luxury-charcoal p-6 rounded-xl border border-luxury-gold/15 shadow-md space-y-4 text-center group hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-full bg-luxury-gold/10 text-luxury-gold font-bold flex items-center justify-center mx-auto text-lg group-hover:bg-luxury-gold group-hover:text-white transition-all">
                4
              </div>
              <h3 className="font-semibold text-base">Easy Return</h3>
              <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 leading-relaxed font-light">
                Pack it back. Our courier partner picks it up from your doorstep. Deposit is returned instantly!
              </p>
            </motion.div>

          </motion.div>

        </div>
      </section>



      {/* 5. TOP VERIFIED BOUTIQUES */}
      <section className="bg-luxury-cream/25 dark:bg-luxury-lightcharcoal/20 py-20 border-y border-luxury-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Verified Boutique Partners</h2>
            <p className="text-sm font-light text-luxury-charcoal/70 dark:text-luxury-alabaster/70">
              We aggregate outfits exclusively from verified designer showrooms and boutiques with strict quality SLAs.
            </p>
            <div className="h-0.5 w-16 bg-luxury-gold mx-auto"></div>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {featuredBoutiques.map((boutique) => (
              <motion.div key={boutique.id} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}>
                <div 
                  className="bg-white dark:bg-luxury-charcoal rounded-xl overflow-hidden shadow-lg border border-luxury-gold/15 group flex flex-col justify-between h-full"
                >
                  <div className="h-40 overflow-hidden relative">
                    <img src={boutique.coverImage} alt={boutique.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-3 right-3 bg-luxury-gold text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Verified
                    </div>
                  </div>

                  <div className="p-6 text-left relative flex-1">
                    
                    {/* Logo overlay */}
                    <img 
                      src={boutique.logo} 
                      alt={boutique.name} 
                      className="w-16 h-16 rounded-full border-2 border-white dark:border-luxury-charcoal object-cover shadow-md absolute -top-8 left-6 bg-white" 
                    />

                    <div className="pt-8 space-y-3">
                      <h3 className="font-bold text-lg dark:text-white flex items-center">
                        {boutique.name}
                      </h3>
                      <p className="text-xs text-luxury-charcoal/50 dark:text-luxury-alabaster/50 font-light">{boutique.location}</p>
                      <p className="text-xs text-luxury-charcoal/70 dark:text-luxury-alabaster/70 leading-relaxed font-light line-clamp-2">
                        {boutique.description}
                      </p>

                      <div className="pt-4 border-t border-luxury-gold/10 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-luxury-gold">{boutique.rating} ★</span>
                          <span className="text-luxury-charcoal/40 dark:text-luxury-alabaster/40 font-light ml-1">({boutique.reviewsCount} bookings)</span>
                        </div>
                        <Link 
                          to={`/catalog?storeName=${encodeURIComponent(boutique.name)}`}
                          className="text-[10px] uppercase font-bold tracking-widest text-luxury-gold hover:text-luxury-bronze"
                        >
                          View Store
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* 6. TRUST INDICATORS (Safety, clean, protection) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Uncompromised Trust & Safety</h2>
          <p className="text-sm font-light text-luxury-charcoal/70 dark:text-luxury-alabaster/70">
            Renting luxury fashion is secure and flawless with our built-in protections.
          </p>
          <div className="h-0.5 w-16 bg-luxury-gold mx-auto"></div>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          
          <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } }} className="p-6 bg-white dark:bg-luxury-lightcharcoal rounded-xl border border-luxury-gold/15 flex items-start space-x-4 shadow-sm text-left hover:shadow-md transition-shadow">
            <div className="p-3 bg-luxury-gold/10 text-luxury-gold rounded-lg flex-shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-semibold text-base dark:text-white">5-Stage Cleanliness Protocol</h3>
              <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 font-light leading-relaxed">
                Outfits undergo dry cleaning, steam pressing, and high-intensity UV sanitization. Sealed vacuum bags protect them until delivery.
              </p>
            </div>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } }} className="p-6 bg-white dark:bg-luxury-lightcharcoal rounded-xl border border-luxury-gold/15 flex items-start space-x-4 shadow-sm text-left hover:shadow-md transition-shadow">
            <div className="p-3 bg-luxury-gold/10 text-luxury-gold rounded-lg flex-shrink-0">
              <Award size={24} />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-semibold text-base dark:text-white">Temporary Custom Fitting</h3>
              <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 font-light leading-relaxed">
                Verified boutique tailors temporarily adjust seam sizes based on your exact body measurements for a custom, bespoke fit.
              </p>
            </div>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } }} className="p-6 bg-white dark:bg-luxury-lightcharcoal rounded-xl border border-luxury-gold/15 flex items-start space-x-4 shadow-sm text-left hover:shadow-md transition-shadow">
            <div className="p-3 bg-luxury-gold/10 text-luxury-gold rounded-lg flex-shrink-0">
              <Calendar size={24} />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-semibold text-base dark:text-white">Seamless Cancellation & Returns</h3>
              <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 font-light leading-relaxed">
                Cancel up to 10 days before your booking for a full refund. Returns include hassle-free courier doorstep pickup.
              </p>
            </div>
          </motion.div>

        </motion.div>
      </section>



      {/* 8. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
        
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <p className="text-sm font-light text-luxury-charcoal/70 dark:text-luxury-alabaster/70">
            Have questions about deposit handling, damages, or returns? We have answers.
          </p>
          <div className="h-0.5 w-16 bg-luxury-gold mx-auto"></div>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="space-y-4"
        >
          {MOCK_FAQS.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <motion.div 
                key={idx} 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                className="border border-luxury-gold/20 rounded-lg overflow-hidden bg-white dark:bg-luxury-lightcharcoal transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-semibold text-sm md:text-base dark:text-white flex items-center">
                    <HelpCircle size={18} className="text-luxury-gold mr-3 flex-shrink-0" />
                    {faq.question}
                  </span>
                  <span className="text-luxury-gold font-bold text-lg flex-shrink-0 ml-4">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 text-xs md:text-sm text-luxury-charcoal/75 dark:text-luxury-alabaster/75 font-light leading-relaxed border-t border-luxury-gold/5 pl-12"
                    >
                      <div className="pb-6 pt-4">{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

    </div>
  );
};

export default Landing;
