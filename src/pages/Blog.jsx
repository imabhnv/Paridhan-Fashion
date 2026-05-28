import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_BLOGS, MOCK_PRODUCTS } from '../data/mockData';
import { Calendar, User, Clock, ArrowLeft, Search, Bookmark, ChevronRight } from 'lucide-react';
import SeoHelper from '../components/SeoHelper';

const Blog = () => {
  const { slug } = useParams();
  
  // Blog Filter State (for index page)
  const [search, setSearch] = React.useState('');
  const [selectedCat, setSelectedCat] = React.useState('All');

  // Related products to show in articles (e.g. recommend a wedding lehenga or tuxedo)
  const promoOutfits = MOCK_PRODUCTS.slice(0, 3);

  // Determine if showing single blog detail page
  if (slug) {
    const post = MOCK_BLOGS.find(b => b.slug === slug);
    
    if (!post) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
          <h2 className="text-xl font-bold dark:text-white">Editorial Article Not Found</h2>
          <Link to="/blog" className="inline-block px-5 py-2.5 bg-luxury-gold text-white text-xs font-bold uppercase rounded">
            Back to Editorial
          </Link>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 text-left animate-fade-in">
        
        {/* Technical SEO Optimizer: Loads custom metadata and Schema markup for Google indexing */}
        <SeoHelper 
          title={post.metaTitle}
          description={post.metaDescription}
          keywords={post.keywords}
          schemaMarkup={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "image": post.coverImage,
            "datePublished": new Date().toISOString(),
            "author": {
              "@type": "Person",
              "name": post.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "Paridhan",
              "logo": {
                "@type": "ImageObject",
                "url": "https://paridhan-rental.web.app/og-image.jpg"
              }
            },
            "description": post.snippet
          }}
        />

        {/* Back Link */}
        <div>
          <Link to="/blog" className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-luxury-gold hover:text-luxury-bronze">
            <ArrowLeft size={14} className="mr-1.5" /> Back to Editorial
          </Link>
        </div>

        {/* Article Header */}
        <div className="space-y-4">
          <span className="bg-luxury-gold/15 text-luxury-gold px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold font-playfair tracking-tight leading-tight dark:text-white">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap gap-4 text-xs text-luxury-charcoal/50 dark:text-luxury-alabaster/50 border-y border-luxury-gold/15 py-3">
            <span className="flex items-center"><User size={14} className="mr-1.5 text-luxury-gold" /> {post.author}</span>
            <span className="flex items-center"><Calendar size={14} className="mr-1.5 text-luxury-gold" /> {post.date}</span>
            <span className="flex items-center"><Clock size={14} className="mr-1.5 text-luxury-gold" /> {post.readTime}</span>
          </div>
        </div>

        {/* Cover Image */}
        <div className="aspect-[2/1] rounded-xl overflow-hidden border border-luxury-gold/15 bg-luxury-cream shadow-md">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Article Body */}
        <article 
          className="prose prose-sm md:prose-base dark:prose-invert prose-headings:font-playfair prose-headings:font-bold prose-a:text-luxury-gold max-w-none text-left leading-relaxed font-light text-xs md:text-base text-luxury-charcoal/80 dark:text-luxury-alabaster/80 space-y-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Editorial Promotion Card (Rent Outfit CTA) */}
        <div className="bg-luxury-cream/35 dark:bg-luxury-lightcharcoal/45 p-6 rounded-xl border border-luxury-gold/20 space-y-4 mt-12 text-center md:text-left">
          <div className="space-y-1">
            <h3 className="font-bold text-lg dark:text-white">Inspired by these Editorial Looks?</h3>
            <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 font-light">Wear them to your upcoming wedding sangeet or gala events at just 3% of retail.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {promoOutfits.map(p => (
              <Link 
                key={p.id}
                to={`/product/${p.id}`}
                className="bg-white dark:bg-luxury-charcoal p-3 rounded-lg border border-luxury-gold/10 flex items-center space-x-3 hover:border-luxury-gold/30 transition-colors text-left"
              >
                <img src={p.images[0]} alt="" className="w-10 h-14 object-cover rounded" />
                <div className="min-w-0">
                  <h4 className="font-semibold text-xs truncate dark:text-white">{p.title}</h4>
                  <p className="text-[9px] text-luxury-gold font-bold uppercase tracking-widest">{p.storeName}</p>
                  <p className="text-xs font-bold dark:text-white mt-1">₹{p.rentalPricePerDay}/day</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    );
  }

  // INDEX VIEW (Lists articles)
  let filteredBlogs = MOCK_BLOGS;
  if (search.trim()) {
    const q = search.toLowerCase();
    filteredBlogs = filteredBlogs.filter(b => b.title.toLowerCase().includes(q) || b.snippet.toLowerCase().includes(q));
  }
  if (selectedCat !== 'All') {
    filteredBlogs = filteredBlogs.filter(b => b.category === selectedCat);
  }

  const blogCategories = ['All', ...new Set(MOCK_BLOGS.map(b => b.category))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-left animate-fade-in">
      
      <SeoHelper 
        title="Fashion Editorial Blog" 
        description="Explore style advice, lehenga rental guides, and sustainable luxury fashion tips in our editorial blog." 
        keywords="fashion rental blog, dress rent guides, lehenga rent trends India"
      />

      <div className="border-b border-luxury-gold/20 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-luxury-charcoal dark:text-white">Fashion Editorial</h1>
          <p className="text-sm font-light text-luxury-charcoal/50 dark:text-luxury-alabaster/50 mt-2">Latest style guides, wedding trends, and sustainable fashion circular updates.</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-9 pr-4 py-2 border border-luxury-gold/25 bg-transparent dark:text-white text-xs rounded focus:outline-none focus:border-luxury-gold"
          />
          <Search className="absolute left-3 top-2.5 text-luxury-gold/50" size={14} />
        </div>
      </div>

      {/* Category selector tags */}
      <div className="flex flex-wrap gap-2 pb-4">
        {blogCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all ${
              selectedCat === cat 
                ? 'bg-luxury-gold border-luxury-gold text-white' 
                : 'border-luxury-gold/20 hover:border-luxury-gold text-luxury-charcoal dark:text-luxury-alabaster'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredBlogs.map(blog => (
          <div 
            key={blog.id}
            className="bg-white dark:bg-luxury-lightcharcoal rounded-xl overflow-hidden shadow-lg border border-luxury-gold/15 group flex flex-col justify-between"
          >
            <div className="h-48 overflow-hidden bg-luxury-cream relative">
              <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute top-3 left-3 bg-luxury-charcoal text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {blog.category}
              </div>
            </div>

            <div className="p-5 text-left flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-bold text-base dark:text-white leading-snug truncate-2 group-hover:text-luxury-gold transition-colors">
                  {blog.title}
                </h3>
                <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 font-light line-clamp-3 leading-relaxed">
                  {blog.snippet}
                </p>
              </div>

              <div className="pt-3 border-t border-luxury-gold/10 flex items-center justify-between text-[10px] text-luxury-charcoal/40 dark:text-luxury-alabaster/40 font-light">
                <span>{blog.date} • {blog.readTime}</span>
                <Link
                  to={`/blog/${blog.slug}`}
                  className="inline-flex items-center font-bold text-luxury-gold uppercase tracking-widest hover:text-luxury-bronze"
                >
                  Read <ChevronRight size={10} className="ml-0.5" />
                </Link>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default Blog;
