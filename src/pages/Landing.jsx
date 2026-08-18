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

  // Hero Accordion state & data
  const [activeHeroCard, setActiveHeroCard] = React.useState(0);
  const heroCards = [
    {
      img: "/assets/Lehanga.jpeg",
      title: "Sabyasachi Heritage",
      desc: "Bridal Lehenga"
    },
    {
      img: "/assets/blue-tuxedo.jpg",
      title: "Raymond Custom",
      desc: "Peak Lapel Tuxedo"
    },
    {
      img: "/assets/cat_designer_sarees_1787056158750.jpg",
      title: "Emerald Banarasi",
      desc: "Designer Saree"
    },
    {
      img: "/assets/modern_fashion.jpg",
      title: "Traditional Classic",
      desc: "Wedding Sherwani"
    }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroCard((prev) => (prev + 1) % heroCards.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [heroCards.length]);

  const categories = [
    { name: "Bridal Wear", img: "/assets/bridal_wear_1787054110911.jpg" },
    { name: "Designer Lehengas", img: "/assets/designer_lehenga_1787054130424.jpg" },
    { name: "Party Wear", img: "/assets/party_wear_1787054158964.jpg" },
    { name: "Ethnic Wear", img: "/assets/ethnic.jpeg" },
    { name: "Tuxedos", img: "/assets/Black-tuxedo.jpg" },
    { name: "Luxury Gowns", img: "/assets/cat_luxury_gowns_1787055572429.jpg" },
    { name: "Sherwanis", img: "/assets/sherwanis_clean.jpg" },
    { name: "Designer Sarees", img: "/assets/sabesh-saree.jpg" },
    { name: "Anarkalis", img: "/assets/anarkalis.jpg" },
    { name: "Kurta Sets", img: "/assets/kurta_sets.jpg" },
    { name: "Indo-Western", img: "/assets/indo_western.jpg" },
    { name: "Accessories", img: "/assets/accessories.jpg" }
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
      <section className="relative min-h-0 flex items-center justify-center bg-luxury-cream/35 dark:bg-luxury-charcoal/10 pt-4 pb-12 px-4">
        
        {/* Dynamic Animated background blobs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-luxury-gold/10 dark:bg-luxury-gold/5 filter blur-3xl"></motion.div>
          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute top-1/2 right-10 w-80 h-80 rounded-full bg-luxury-gold/15 dark:bg-luxury-gold/5 filter blur-3xl"></motion.div>
        </div>

        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
          
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
              Rent premium designer couture for weddings, sangeets, cocktail parties, and festivals at the comfort of your home.
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
            <div 
              className="relative w-full h-[450px] md:h-[500px] flex items-center justify-center mx-auto lg:mr-16 lg:-translate-x-16 select-none"
            >
              {heroCards.map((card, idx) => {
                const isActive = activeHeroCard === idx;
                const offset = idx - activeHeroCard;
                
                // 3D coverflow values
                const xPos = offset * 110; 
                const rotateDeg = offset * 8; 
                const scaleValue = isActive ? 1.05 : 0.85;
                const zIndexValue = 40 - Math.abs(offset);
                const opacityValue = Math.abs(offset) > 1 ? 0.5 : 1;

                return (
                  <motion.div
                    key={idx}
                    animate={{
                      x: xPos,
                      scale: scaleValue,
                      rotate: rotateDeg,
                      zIndex: zIndexValue,
                      opacity: opacityValue
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 24
                    }}
                    className={`absolute w-56 h-80 md:w-64 md:h-96 rounded-3xl overflow-hidden border bg-white shadow-2xl cursor-pointer ${
                      isActive ? 'border-luxury-gold/50' : 'border-luxury-gold/15'
                    }`}
                  >
                    <img 
                      src={card.img} 
                      alt={card.title} 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. FEATURED CATEGORIES */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
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
            <motion.div whileHover={{ y: -8, scale: 1.02, rotate: idx % 2 === 0 ? 1 : -1 }} key={idx} variants={{ hidden: { opacity: 0, y: 30, scale: 0.9 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, type: "spring", bounce: 0.4 } } }} className="h-full cursor-default">
              <div 
                className="group relative h-72 rounded-xl overflow-hidden shadow-lg border border-luxury-gold/10 hover:border-luxury-gold/40 flex items-end p-4 transition-all duration-300 block w-full"
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/35 z-10 transition-all"></div>
                <img 
                  src={cat.img} 
                  alt={cat.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125 group-hover:-rotate-3" 
                />
                <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="relative z-20 text-left text-white w-full space-y-0.5 overflow-hidden">
                  <h3 className="text-sm font-semibold tracking-wide truncate group-hover:text-luxury-gold transition-colors">{cat.name}</h3>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="bg-luxury-cream/45 dark:bg-luxury-lightcharcoal/40 py-20 border-y border-luxury-gold/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
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
            <motion.div whileHover={{ y: -10, scale: 1.02 }} variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className="bg-white dark:bg-luxury-charcoal p-6 rounded-xl border border-luxury-gold/15 shadow-md space-y-4 text-center group hover:shadow-2xl transition-all relative z-10">
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="w-12 h-12 rounded-full bg-luxury-gold/10 text-luxury-gold font-bold flex items-center justify-center mx-auto text-lg group-hover:bg-luxury-gold group-hover:text-white transition-all">
                1
              </motion.div>
              <h3 className="font-semibold text-base">Select Outfit</h3>
              <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 leading-relaxed font-light">
                Browse our premium designer catalog and filter by size, color, design, and dates.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div whileHover={{ y: -10, scale: 1.02 }} variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className="bg-white dark:bg-luxury-charcoal p-6 rounded-xl border border-luxury-gold/15 shadow-md space-y-4 text-center group hover:shadow-2xl transition-all relative z-10">
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="w-12 h-12 rounded-full bg-luxury-gold/10 text-luxury-gold font-bold flex items-center justify-center mx-auto text-lg group-hover:bg-luxury-gold group-hover:text-white transition-all">
                2
              </motion.div>
              <h3 className="font-semibold text-base">Reserve & Pay</h3>
              <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 leading-relaxed font-light">
                Choose a 3, 5, or 7 day booking window. Make a secure, deposit-inclusive payment.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div whileHover={{ y: -10, scale: 1.02 }} variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className="bg-white dark:bg-luxury-charcoal p-6 rounded-xl border border-luxury-gold/15 shadow-md space-y-4 text-center group hover:shadow-2xl transition-all relative z-10">
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="w-12 h-12 rounded-full bg-luxury-gold/10 text-luxury-gold font-bold flex items-center justify-center mx-auto text-lg group-hover:bg-luxury-gold group-hover:text-white transition-all">
                3
              </motion.div>
              <h3 className="font-semibold text-base">Flaunt It</h3>
              <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 leading-relaxed font-light">
                Receive the custom-fitted, UV-sanitized outfit in a luxury bag. Rock your special event!
              </p>
            </motion.div>

            {/* Step 4 */}
            <motion.div whileHover={{ y: -10, scale: 1.02 }} variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className="bg-white dark:bg-luxury-charcoal p-6 rounded-xl border border-luxury-gold/15 shadow-md space-y-4 text-center group hover:shadow-2xl transition-all relative z-10">
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} className="w-12 h-12 rounded-full bg-luxury-gold/10 text-luxury-gold font-bold flex items-center justify-center mx-auto text-lg group-hover:bg-luxury-gold group-hover:text-white transition-all">
                4
              </motion.div>
              <h3 className="font-semibold text-base">Easy Return</h3>
              <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 leading-relaxed font-light">
                Pack it back. Our courier partner picks it up from your doorstep. Deposit is returned instantly!
              </p>
            </motion.div>
            
            {/* Decorative Floating Cards - Harmoniously Aligned & Styled */}
            
            {/* Top-Left Floating Card (Lehenga Close-up) */}
            <motion.div 
              animate={{ y: [0, -12, 0], rotate: [-6, -2, -6] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-20 -left-16 w-28 h-36 rounded-2xl overflow-hidden border-2 border-luxury-gold/25 shadow-xl opacity-30 md:opacity-85 z-0 hidden lg:block pointer-events-none"
            >
              <img src="/assets/bridal_wear_1787054110911.jpg" alt="Deco Top Left" className="w-full h-full object-cover" />
            </motion.div>

            {/* Bottom-Left Floating Card (Saree fabric detail) */}
            <motion.div 
              animate={{ y: [0, 10, 0], rotate: [8, 12, 8] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-16 left-1/4 w-24 h-32 rounded-2xl overflow-hidden border-2 border-luxury-gold/20 shadow-xl opacity-20 md:opacity-75 z-0 hidden lg:block pointer-events-none"
            >
              <img src="/assets/cat_designer_sarees_1787056158750.jpg" alt="Deco Bottom Left" className="w-full h-full object-cover" />
            </motion.div>

            {/* Top-Right Floating Card (Tuxedo texture) */}
            <motion.div 
              animate={{ y: [0, -8, 0], rotate: [-8, -4, -8] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -top-12 right-1/4 w-24 h-32 rounded-2xl overflow-hidden border-2 border-luxury-gold/20 shadow-xl opacity-20 md:opacity-75 z-0 hidden lg:block pointer-events-none"
            >
              <img src="/assets/cat_tuxedos_1787057033970.jpg" alt="Deco Top Right" className="w-full h-full object-cover" />
            </motion.div>

            {/* Bottom-Right Floating Card (Anarkali close-up) */}
            <motion.div 
              animate={{ y: [0, 15, 0], rotate: [5, 10, 5] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute -bottom-20 -right-16 w-28 h-36 rounded-2xl overflow-hidden border-2 border-luxury-gold/25 shadow-xl opacity-30 md:opacity-85 z-0 hidden lg:block pointer-events-none"
            >
              <img src="/assets/cat_anarkalis_1787056519153.jpg" alt="Deco Bottom Right" className="w-full h-full object-cover" />
            </motion.div>

          </motion.div>

        </div>
      </section>

      {/* 4. DIGITAL RUNWAY & INTERACTIVE GALLERY */}
      <section className="py-20 overflow-hidden relative bg-luxury-charcoal text-white dark:bg-black">
        {/* Soft atmospheric background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-luxury-gold/5 to-transparent pointer-events-none"></div>

        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
          
          <div className="text-center max-w-xl mx-auto space-y-3">
            <motion.span 
              initial={{ letterSpacing: "0.1em", opacity: 0 }}
              whileInView={{ letterSpacing: "0.2em", opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-[10px] uppercase font-bold tracking-widest text-luxury-gold block"
            >
              Interactive Showcase
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-playfair text-white">The Digital Runway</h2>
            <p className="text-sm font-light text-luxury-alabaster/70">
              Immerse yourself in our premier collections with fluid, interactive editorial animations.
            </p>
            <div className="h-0.5 w-16 bg-luxury-gold mx-auto"></div>
          </div>

          {/* Animation 1: The Infinite Scrolling Runway Marquee */}
          <div className="relative w-full overflow-hidden py-4 border-y border-luxury-gold/15 bg-black/35 backdrop-blur-sm">
            <div className="flex w-[200%] gap-8 animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] whitespace-nowrap">
              {/* First loop */}
              {[
                { name: "Bridal Portrait", img: "/assets/bridal_wear_1787054110911.jpg" },
                { name: "Golden Detail", img: "/assets/designer_lehenga.jpg" },
                { name: "Purple Gown", img: "/assets/runway_gown_purple.jpg" },
                { name: "Royal Sherwani", img: "/assets/sherwanis.jpg" },
                { name: "Suit Blue", img: "/assets/blue-tuxedo.jpg" },
                { name: "Bespoke Couture", img: "/assets/sabesh-saree.jpg" },
                { name: "Groom Sherwani", img: "/assets/cat_sherwanis_1787056047869.jpg" },
                { name: "Showroom Select", img: "/assets/modern_fashion.jpg" },
              ].map((item, idx) => (
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  key={`runway-1-${idx}`} 
                  className="inline-flex flex-col items-center gap-2 cursor-pointer w-40 flex-shrink-0"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-luxury-gold/30 shadow-2xl">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] tracking-widest uppercase font-semibold text-luxury-gold/80">{item.name}</span>
                </motion.div>
              ))}
              {/* Second loop (duplicate for seamless loop) */}
              {[
                { name: "Bridal Portrait", img: "/assets/bridal_wear_1787054110911.jpg" },
                { name: "Golden Detail", img: "/assets/designer_lehenga.jpg" },
                { name: "Purple Gown", img: "/assets/runway_gown_purple.jpg" },
                { name: "Royal Sherwani", img: "/assets/sherwanis.jpg" },
                { name: "Suit Blue", img: "/assets/blue-tuxedo.jpg" },
                { name: "Bespoke Couture", img: "/assets/sabesh-saree.jpg" },
                { name: "Groom Sherwani", img: "/assets/cat_sherwanis_1787056047869.jpg" },
                { name: "Showroom Select", img: "/assets/modern_fashion.jpg" },
              ].map((item, idx) => (
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  key={`runway-2-${idx}`} 
                  className="inline-flex flex-col items-center gap-2 cursor-pointer w-40 flex-shrink-0"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-luxury-gold/30 shadow-2xl">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] tracking-widest uppercase font-semibold text-luxury-gold/80">{item.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. TOP VERIFIED BOUTIQUES */}
      <section className="bg-luxury-cream/25 dark:bg-luxury-lightcharcoal/20 py-20 border-y border-luxury-gold/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
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
              <motion.div whileHover={{ y: -12 }} key={boutique.id} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}>
                <div 
                  className="bg-white dark:bg-luxury-charcoal rounded-xl overflow-hidden shadow-2xl border border-luxury-gold/15 group flex flex-col justify-between h-full"
                >
                  <div className="h-40 overflow-hidden relative">
                    <img src={boutique.coverImage} alt={boutique.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-3 right-3 bg-luxury-gold text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                      Verified
                    </div>
                  </div>

                  <div className="p-6 text-left relative flex-1">
                    <div className="pt-2 space-y-3">
                      <h3 className="font-bold text-lg dark:text-white flex items-center group-hover:text-luxury-gold transition-colors">
                        {boutique.name}
                      </h3>
                      <p className="text-xs text-luxury-charcoal/50 dark:text-luxury-alabaster/50 font-light">{boutique.location}</p>
                      <p className="text-xs text-luxury-charcoal/70 dark:text-luxury-alabaster/70 leading-relaxed font-light line-clamp-2">
                        {boutique.description}
                      </p>

                      <div className="pt-4 border-t border-luxury-gold/10 flex items-center justify-between text-xs mt-auto">
                        <div>
                          {boutique.reviewsCount > 0 ? (
                            <>
                              <span className="font-semibold text-luxury-gold">{boutique.rating} ★</span>
                              <span className="text-luxury-charcoal/40 dark:text-luxury-alabaster/40 font-light ml-1">({boutique.reviewsCount} bookings)</span>
                            </>
                          ) : (
                            <span className="text-xs text-luxury-charcoal/50 dark:text-luxury-alabaster/50 font-medium italic">New Boutique</span>
                          )}
                        </div>
                        <Link 
                          to={`/catalog?storeName=${encodeURIComponent(boutique.name)}`}
                          className="text-[10px] uppercase font-bold tracking-widest text-luxury-gold hover:text-luxury-bronze flex items-center gap-1 group/btn"
                        >
                          View Store <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
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
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
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
          
          <motion.div whileHover={{ scale: 1.05, y: -5 }} variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } }} className="p-6 bg-white dark:bg-luxury-lightcharcoal rounded-xl border border-luxury-gold/15 flex items-start space-x-4 shadow-lg text-left transition-all">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="p-3 bg-luxury-gold/10 text-luxury-gold rounded-lg flex-shrink-0">
              <ShieldCheck size={24} />
            </motion.div>
            <div className="space-y-1.5">
              <h3 className="font-semibold text-base dark:text-white">5-Stage Cleanliness Protocol</h3>
              <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 font-light leading-relaxed">
                Outfits undergo dry cleaning, steam pressing, and high-intensity UV sanitization. Sealed vacuum bags protect them until delivery.
              </p>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05, y: -5 }} variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.1 } } }} className="p-6 bg-white dark:bg-luxury-lightcharcoal rounded-xl border border-luxury-gold/15 flex items-start space-x-4 shadow-lg text-left transition-all">
            <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }} className="p-3 bg-luxury-gold/10 text-luxury-gold rounded-lg flex-shrink-0">
              <Award size={24} />
            </motion.div>
            <div className="space-y-1.5">
              <h3 className="font-semibold text-base dark:text-white">Temporary Custom Fitting</h3>
              <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 font-light leading-relaxed">
                Verified boutique tailors temporarily adjust seam sizes based on your exact body measurements for a custom, bespoke fit.
              </p>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05, y: -5 }} variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.2 } } }} className="p-6 bg-white dark:bg-luxury-lightcharcoal rounded-xl border border-luxury-gold/15 flex items-start space-x-4 shadow-lg text-left transition-all relative">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="p-3 bg-luxury-gold/10 text-luxury-gold rounded-lg flex-shrink-0">
              <Calendar size={24} />
            </motion.div>
            <div className="space-y-1.5">
              <h3 className="font-semibold text-base dark:text-white">Seamless Cancellation & Returns</h3>
              <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 font-light leading-relaxed">
                Cancel up to 10 days before your booking for a full refund. Returns include hassle-free courier doorstep pickup.
              </p>
            </div>
            {/* Tiny deco element */}
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-4 -right-4 bg-luxury-gold text-white p-2 rounded-full shadow-lg">
              <Sparkles size={14} />
            </motion.div>
          </motion.div>

          {/* Background decorative floating card for Trust section */}
          <motion.div 
            animate={{ y: [0, 15, 0], rotate: [-5, 5, -5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-10 w-20 h-24 rounded-lg overflow-hidden border border-luxury-gold/20 shadow-xl opacity-20 pointer-events-none hidden lg:block"
          >
            <img src="/assets/cat_accessories_1787056661975.jpg" alt="Deco" className="w-full h-full object-cover" />
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
