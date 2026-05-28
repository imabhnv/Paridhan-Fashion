// Mock Data for Paridhan Luxury Fashion Rental

export const MOCK_BOUTIQUES = [
  {
    id: "boutique-1",
    name: "Sabyasachi Heritage",
    logo: "https://images.unsplash.com/photo-1541103864913-2713725b3272?auto=format&fit=crop&w=150&h=150&q=80",
    coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 188,
    location: "Colaba, Mumbai",
    description: "Classic Indian heritage bridal couture and handcrafted jewelry.",
    verified: true,
    joinedDate: "Jan 2024",
    totalBookings: 1240,
    featured: true
  },
  {
    id: "boutique-2",
    name: "Manish Malhotra Atelier",
    logo: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=150&h=150&q=80",
    coverImage: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewsCount: 245,
    location: "Chanakyapuri, New Delhi",
    description: "Glamorous contemporary Indian designs, high-shine lehengas, and cocktail outfits.",
    verified: true,
    joinedDate: "Feb 2024",
    totalBookings: 2150,
    featured: true
  },
  {
    id: "boutique-3",
    name: "Anita Dongre Couture",
    logo: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=150&h=150&q=80",
    coverImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviewsCount: 112,
    location: "Juhu, Mumbai",
    description: "Sustainable luxury ethnic wear inspired by Rajasthani craftsmanship.",
    verified: true,
    joinedDate: "Mar 2024",
    totalBookings: 890,
    featured: false
  },
  {
    id: "boutique-4",
    name: "House of Masaba",
    logo: "https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=150&h=150&q=80",
    coverImage: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    reviewsCount: 95,
    location: "Koramangala, Bengaluru",
    description: "Quirky, vibrant print ethnic and fusion wear for the modern woman.",
    verified: true,
    joinedDate: "May 2024",
    totalBookings: 610,
    featured: false
  },
  {
    id: "boutique-5",
    name: "Raymond Premium Tuxedos",
    logo: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=150&h=150&q=80",
    coverImage: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewsCount: 134,
    location: "Connaught Place, New Delhi",
    description: "Finest quality bespoke formal suits, tuxedos, and bandhgalas for men.",
    verified: true,
    joinedDate: "Jan 2024",
    totalBookings: 1100,
    featured: true
  }
];

export const MOCK_PRODUCTS = [
  {
    id: "prod-1",
    title: "Crimson Royal Heritage Lehenga",
    category: "Designer Lehengas",
    gender: "Women",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&h=800&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&h=800&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&h=800&q=80"
    ],
    rentalPricePerDay: 4500,
    originalRetailPrice: 185000,
    securityDeposit: 6000,
    storeId: "boutique-1",
    storeName: "Sabyasachi Heritage",
    rating: 4.9,
    reviewsCount: 42,
    sizes: ["S", "M", "L"],
    colors: ["Crimson Red", "Gold", "Maroon"],
    fabric: "Raw Silk & Banarasi Brocade with Zardozi hand embroidery",
    occasion: "Bridal Wear / Wedding",
    description: "Make a statement on your big day with this iconic crimson lehenga featuring intricate hand-embroidered floral motifs, zardozi work, and heavy borders. Comes with a matching silk choli and dual sheer net dupattas.",
    availability: true,
    bookedDates: ["2026-06-05", "2026-06-06", "2026-06-07"],
    cleanlinessRating: 5.0,
    stylistNotes: "Pair with vintage kundan or polki jewelry and a low hair bun to complete the regal traditional look.",
    verified: true
  },
  {
    id: "prod-2",
    title: "Midnight Sequin Cocktail Lehenga",
    category: "Party Wear",
    gender: "Women",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&h=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&h=800&q=80"
    ],
    rentalPricePerDay: 3800,
    originalRetailPrice: 120000,
    securityDeposit: 5000,
    storeId: "boutique-2",
    storeName: "Manish Malhotra Atelier",
    rating: 4.8,
    reviewsCount: 31,
    sizes: ["XS", "S", "M"],
    colors: ["Navy Blue", "Silver"],
    fabric: "Georgette with all-over metallic sequins and satin lining",
    occasion: "Reception / Cocktail Party",
    description: "Dazzle in the night with this ultra-modern, high-glitz sequined lehenga. The navy blue fabric is embellished with thousands of micro-sequins creating a shimmering effect. Includes a contemporary halter-neck blouse.",
    availability: true,
    bookedDates: ["2026-05-30", "2026-05-31"],
    cleanlinessRating: 4.9,
    stylistNotes: "Let the outfit shine by keeping accessories minimal. Sleek diamond studs and high heels are perfect.",
    verified: true
  },
  {
    id: "prod-3",
    title: "Classic Italian Peak Lapel Tuxedo",
    category: "Tuxedos",
    gender: "Men",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&h=800&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&h=800&q=80"
    ],
    rentalPricePerDay: 2500,
    originalRetailPrice: 45000,
    securityDeposit: 3500,
    storeId: "boutique-5",
    storeName: "Raymond Premium Tuxedos",
    rating: 4.8,
    reviewsCount: 56,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Midnight Black"],
    fabric: "Premium Merino Wool Blend with silk satin lapels",
    occasion: "Reception / College Farewell / Special Events",
    description: "Look your absolute best in this premium, slim-fit black tuxedo. Features a structured jacket with silk satin peak lapels, matching trousers, and a crisp white cotton tuxedo shirt with black studs.",
    availability: true,
    bookedDates: [],
    cleanlinessRating: 5.0,
    stylistNotes: "Comes with a free pre-tied silk bowtie and matching pocket square. Perfect with black patent leather shoes.",
    verified: true
  },
  {
    id: "prod-4",
    title: "Pastel Mint Green Floral Lehenga",
    category: "Ethnic Wear",
    gender: "Women",
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&h=800&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&h=800&q=80"
    ],
    rentalPricePerDay: 2900,
    originalRetailPrice: 85000,
    securityDeposit: 4000,
    storeId: "boutique-3",
    storeName: "Anita Dongre Couture",
    rating: 4.7,
    reviewsCount: 18,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Mint Green", "Pink", "Gold"],
    fabric: "Organza Lehenga with hand-painted floral prints and gota patti work",
    occasion: "Sangeet / Mehendi / Festivals",
    description: "Fresh, breezy, and effortlessly beautiful. This mint green organza lehenga is decorated with vibrant hand-painted floral designs and subtle gota patti embroidery, ideal for daytime events, sangeet, and festivals.",
    availability: true,
    bookedDates: ["2026-06-12", "2026-06-13"],
    cleanlinessRating: 4.8,
    stylistNotes: "Ideal for daytime garden weddings. Style with pastel pink floral jewelry or silver oxidized jhumkas.",
    verified: true
  },
  {
    id: "prod-5",
    title: "Emerald Silk Sherwani Set",
    category: "Ethnic Wear",
    gender: "Men",
    images: [
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=600&h=800&q=80",
      "https://images.unsplash.com/photo-1597983073492-bc24058b375b?auto=format&fit=crop&w=600&h=800&q=80"
    ],
    rentalPricePerDay: 3200,
    originalRetailPrice: 95000,
    securityDeposit: 4500,
    storeId: "boutique-1",
    storeName: "Sabyasachi Heritage",
    rating: 4.9,
    reviewsCount: 22,
    sizes: ["M", "L", "XL"],
    colors: ["Emerald Green", "Cream"],
    fabric: "Handwoven Banarasi Silk Sherwani with churidar trousers",
    occasion: "Wedding / Reception / Sangeet",
    description: "An elegant emerald green sherwani set crafted in premium Banarasi silk, featuring a classic bandhgala collar, signature gold monogram buttons, and a matching gold tissue stole.",
    availability: true,
    bookedDates: [],
    cleanlinessRating: 5.0,
    stylistNotes: "Complete the look with cream mojris and a maroon pocket square for a striking contrast.",
    verified: true
  },
  {
    id: "prod-6",
    title: "Vibrant Fuchsia Fusion Kaftan",
    category: "Influencer Fashion",
    gender: "Women",
    images: [
      "https://images.unsplash.com/photo-1561932850-f13404855e53?auto=format&fit=crop&w=600&h=800&q=80",
      "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=600&h=800&q=80"
    ],
    rentalPricePerDay: 1800,
    originalRetailPrice: 35000,
    securityDeposit: 2500,
    storeId: "boutique-4",
    storeName: "House of Masaba",
    rating: 4.6,
    reviewsCount: 14,
    sizes: ["S", "M", "L"],
    colors: ["Fuchsia Pink", "Mustard Gold"],
    fabric: "Crepe silk with quirky foil stamps and tasseled details",
    occasion: "Sangeet / Mehendi / Festivals",
    description: "Stand out in photos with this modern fuchsia kaftan featuring signature Masaba prints in gold foil. Flows beautifully, feels extremely comfortable, and gives a major fashion statement.",
    availability: true,
    bookedDates: [],
    cleanlinessRating: 4.7,
    stylistNotes: "A great option for pre-wedding functions and festivals. Pair with chunky golden hoops and sleek flats.",
    verified: false
  },
  {
    id: "prod-7",
    title: "Blush Pink Rose Gown",
    category: "Luxury Gowns",
    gender: "Women",
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&h=800&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&h=800&q=80"
    ],
    rentalPricePerDay: 3500,
    originalRetailPrice: 110000,
    securityDeposit: 5000,
    storeId: "boutique-2",
    storeName: "Manish Malhotra Atelier",
    rating: 4.7,
    reviewsCount: 19,
    sizes: ["S", "M"],
    colors: ["Blush Pink"],
    fabric: "Tulle and Silk Gown with delicate hand-stitched rose appliques",
    occasion: "Reception / Prom / Cocktail Party",
    description: "A dreamy blush pink evening gown featuring a structured corset bodice, flowing layered tulle skirt, and beautifully scattered hand-sewn fabric roses. Exudes pure luxury.",
    availability: true,
    bookedDates: ["2026-06-20"],
    cleanlinessRating: 4.9,
    stylistNotes: "Perfect for receptions and galas. Match with soft pink makeup and a delicate neck chain.",
    verified: true
  },
  {
    id: "prod-8",
    title: "Ivory Pearl Velvet Bandhgala",
    category: "Bridal Wear",
    gender: "Men",
    images: [
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=600&h=800&q=80",
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=600&h=800&q=80"
    ],
    rentalPricePerDay: 3900,
    originalRetailPrice: 140000,
    securityDeposit: 5500,
    storeId: "boutique-1",
    storeName: "Sabyasachi Heritage",
    rating: 4.9,
    reviewsCount: 15,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Ivory", "Gold"],
    fabric: "Luxurious Italian Velvet with gold bullion embroidery and pearl buttons",
    occasion: "Bridal Wear / Wedding",
    description: "Walk down the aisle in style. This ivory velvet bandhgala coat showcases sophisticated gold floral embroidery along the collar, cuffs, and hemline. Finished with genuine mother-of-pearl buttons.",
    availability: true,
    bookedDates: [],
    cleanlinessRating: 5.0,
    stylistNotes: "Wear with slim-fit cream trousers, a gold safa (turban), and velvet loafers for a high-end groom ensemble.",
    verified: true
  }
];

export const MOCK_BLOGS = [
  {
    id: "blog-1",
    slug: "best-wedding-outfits-on-rent",
    title: "The Ultimate Guide: Best Wedding Outfits on Rent for Grooms & Brides",
    category: "Wedding Trends",
    coverImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    snippet: "Why buy a lehenga or sherwani that you will wear only once? Explore the top trends in wedding outfit rentals that can save you lakhs of rupees while looking like a million bucks.",
    author: "Aditi Sharma, Bridal Consultant",
    date: "May 15, 2026",
    readTime: "5 mins read",
    content: `
      <p>Your wedding day is one of the most memorable events of your life, and naturally, you want to look your absolute best. However, wedding fashion has reached unprecedented heights in terms of both beauty and cost. A premium designer lehenga from Anita Dongre or Sabyasachi can easily set you back anywhere between ₹1,50,000 to ₹10,000,000. For grooms, designer bandhgalas or sherwanis cost similar amounts.</p>
      
      <h3>The Reality of Wedding Outfits</h3>
      <p>The hard truth is that wedding outfits are almost never worn a second time. They sit in luxury garment bags, occupying closet space, and slowly going out of style. This is why smart modern couples are turning to fashion rental marketplaces like <strong>Paridhan</strong>.</p>
      
      <h3>Top Wedding Rental Trends for Brides</h3>
      <ul>
        <li><strong>Royal Crimson Red Lehengas:</strong> Classic reds with heavy gold work remain the undisputed favorite for pheras.</li>
        <li><strong>Pastel Floral Organzas:</strong> Perfect for daytime outdoor weddings, sangeet, and mehendi functions. Mint green, blush pink, and lavender are dominating the scene.</li>
        <li><strong>Shimmering Metallic Gowns:</strong> The cocktail and reception parties demand modern luxury, and deep navy or silver sequin gowns are the perfect fit.</li>
      </ul>

      <h3>Top Wedding Rental Trends for Grooms</h3>
      <ul>
        <li><strong>Italian Cut Tuxedos:</strong> Ideal for cocktail nights and receptions. Standard black or midnight blue are timeless classics.</li>
        <li><strong>Ivory Velvet Bandhgalas:</strong> Exude royalty during pheras or reception with heavy embroidery.</li>
        <li><strong>Emerald Silk Sherwanis:</strong> Pair with contrast stoles to look premium and traditional.</li>
      </ul>

      <h3>Why Renting via Paridhan is Safer</h3>
      <p>Unlike local neighborhood rental stores, Paridhan guarantees dry-cleaning and multi-stage sanitization (including UV light treatment) for every single dress. Our boutiques are verified, and we include damage protection so you can enjoy your event stress-free!</p>
    `,
    metaTitle: "Best Wedding Outfits on Rent for Brides & Grooms | Paridhan Blog",
    metaDescription: "Save lakhs on your wedding outfits. Read the ultimate guide to renting designer lehengas, sherwanis, and tuxedos for weddings in India.",
    keywords: "wedding outfits on rent, rent wedding lehenga, designer sherwani rental, wedding dress rental, bridal rental outfits"
  },
  {
    id: "blog-2",
    slug: "why-renting-luxury-fashion-is-smarter",
    title: "Why Renting Luxury Fashion is Smarter and Sustainable",
    category: "Sustainable Fashion",
    coverImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
    snippet: "The fashion industry is one of the largest polluters in the world. Renting designer clothes is not just friendly on your wallet, it also significantly reduces environmental waste.",
    author: "Rohan Varma, Eco-Fashion Advocate",
    date: "May 20, 2026",
    readTime: "4 mins read",
    content: `
      <p>Fast fashion has trained us to buy clothes, wear them three times, and discard them. But when it comes to luxury fashion, the waste is even more pronounced because the garments require specialized materials, hundreds of hours of manual labor, and resources that are highly carbon-intensive.</p>

      <h3>The Environmental Cost of Luxury Wear</h3>
      <p>A single heavy silk lehenga uses thousands of liters of water during production, dyeing, and embroidery. When a garment is worn only once, the environmental investment is completely lost. By creating a sharing economy through renting, we can extend the lifecycle of a garment by 10x to 15x.</p>

      <h3>Economic Benefits of Renting</h3>
      <p>Why block ₹1,00,000 in an outfit when you can rent it for ₹3,000? That is 3% of the cost. The rest of the money can be invested or spent on creating memorable experiences during the event. Furthermore, renting allows you to wear different designer outfits for every single event instead of repeating the same expensive outfit to justify its purchase.</p>

      <h3>Paridhan's Sustainability Mission</h3>
      <p>At Paridhan, we partner with verified local boutiques to list their unsold or idle premium inventory. This empowers local businesses, provides them an alternative revenue stream, and keeps premium fashion in circulation, preventing them from ending up in landfills. Join the circular fashion revolution today!</p>
    `,
    metaTitle: "Why Renting Luxury Fashion is Smarter & Sustainable | Paridhan",
    metaDescription: "Discover the economic and environmental benefits of renting designer clothing. Learn how circular fashion is shaping the future of retail.",
    keywords: "sustainable fashion, circular fashion rental, rental clothes eco friendly, rent designer clothing, luxury fashion rent benefit"
  },
  {
    id: "blog-3",
    slug: "top-lehenga-trends-this-season",
    title: "Top 5 Lehenga Trends You Need to Know This Wedding Season",
    category: "Fashion Guides",
    coverImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    snippet: "From hand-painted organza florals to shimmering sequin cascades, here are the designer lehenga trends that are ruling the runways and weddings this year.",
    author: "Meera Sen, Fashion Stylist",
    date: "May 25, 2026",
    readTime: "6 mins read",
    content: `
      <p>Wedding fashion is evolving rapidly. While red remains a sacred bridal color, modern brides and sangeet guests are choosing to experiment with colors, fabrics, and embroideries. If you are attending a wedding or hosting one soon, here are the top lehenga trends you should look for.</p>

      <h3>1. Hand-Painted Organza Florals</h3>
      <p>Heavy velvet lehengas can weigh up to 15 kilograms, making it hard to dance or walk. Light organza lehengas with gorgeous pastel floral prints and highlights of gota-patti are the season's breakout hit. Brands like Anita Dongre have popularized this breezy, elegant style.</p>

      <h3>2. High-Octane Metallic Sequins</h3>
      <p>If you want to own the stage during the sangeet or look glamorous at the cocktail party, sequins are your best friend. Midnight blues, emerald greens, and rose golds embellished with micro-sequins offer an incredible, light-catching sheen.</p>

      <h3>3. Monochromatic Ivory & Gold</h3>
      <p>Ivory has emerged as the new favorite bridal shade, moving away from conventional dark colors. An ivory lehenga with gold thread embroidery and pearl works looks exceptionally sophisticated, neat, and photogenic.</p>

      <h3>4. Quirky Fusion Prints</h3>
      <p>For mehendi or haldi, modern bridesmaids are picking up fusion silhouettes like lehengas with kaftan blouses or crop tops in bold, graphic prints. House of Masaba is the pioneer of this playful trend.</p>

      <h3>Rent Them for Your Next Event</h3>
      <p>All these runway trends are available on rent at Paridhan. Check out our designer catalog, filter by your size, and lock down your favorites before the wedding dates get booked!</p>
    `,
    metaTitle: "Top 5 Lehenga Trends This Wedding Season | Paridhan",
    metaDescription: "Find your perfect wedding look. Read about the hottest designer lehenga trends including floral organzas, sequins, and ivory embroideries.",
    keywords: "lehenga trends, designer lehengas on rent, wedding lehenga ideas, pastel lehenga, sequin lehenga rental"
  }
];

export const MOCK_TESTIMONIALS = [
  {
    id: "t-1",
    name: "Ridhima Sen",
    role: "Bride / Corporate Lawyer",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80",
    quote: "I rented my dream Sabyasachi bridal lehenga from Paridhan. It arrived perfectly sanitized, altered to my size, and sealed. Everyone thought I bought it! Saved almost 1.5 lakhs.",
    rating: 5
  },
  {
    id: "t-2",
    name: "Kabir Malhotra",
    role: "Influencer / Tech Lead",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100&q=80",
    quote: "As a groomsman, I had 3 weddings back-to-back. Instead of buying three outfits, I rented two sherwanis and a Raymond tuxedo. Super convenient, sustainable, and fit perfectly.",
    rating: 5
  },
  {
    id: "t-3",
    name: "Priya Das",
    role: "Boutique Owner, Juhu",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
    quote: "Paridhan changed my boutique business. Our premium bridal pieces that sat idle for months are now rented out multiple times a month, generating steady extra revenue.",
    rating: 5
  }
];

export const MOCK_FAQS = [
  {
    question: "How does the rental duration and deposit work?",
    answer: "You can rent outfits for 3, 5, or 7 days. The pricing scales based on the duration. We charge a refundable security deposit to cover minor alterations or accidents. The deposit is automatically refunded within 48 hours of return check."
  },
  {
    question: "How do you ensure cleanliness and hygiene?",
    answer: "Hygiene is our top priority. Every outfit undergoes a strict 5-stage cleaning process: dry cleaning, steam pressing, UV sanitization, vacuum sealing, and quality assurance packing in premium garment bags."
  },
  {
    question: "What happens if there is minor damage to the outfit?",
    answer: "We offer an optional Damage Protection cover at checkout for a nominal fee. This covers minor spills, loose threads, and small stains. Major tears or permanent damages are assessed by our claims team using the security deposit."
  },
  {
    question: "Can I get the outfit fitted to my measurements?",
    answer: "Yes! During booking, you can input your measurements. Our verified partner boutiques provide temporary, non-destructive alterations (like side stitching adjustments) so the outfit fits you perfectly upon delivery."
  },
  {
    question: "What is your return process?",
    answer: "Returning is hassle-free. On the final day of your rental, a courier partner will schedule a pickup at your address. You just need to place the outfit back in the provided premium garment box."
  }
];
