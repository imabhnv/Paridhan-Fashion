import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, Bot, User, Send, X, Shirt, CheckCircle, Camera } from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/mockData';
import { Link } from 'react-router-dom';

const FloatingCta = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'tryon'
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Namaste! I am your Paridhan AI Stylist. Tell me what event you are planning for, and I will recommend the perfect designer outfit.' }
  ]);
  const [inputText, setInputText] = useState('');
  
  // Try on state
  const [selectedTryOnProduct, setSelectedTryOnProduct] = useState(MOCK_PRODUCTS[0]);
  const [tryOnPhoto, setTryOnPhoto] = useState(null);
  const [tryOnProcessing, setTryOnProcessing] = useState(false);
  const [tryOnSuccess, setTryOnSuccess] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Simulate bot response after 1s
    setTimeout(() => {
      let botResponseText = "That sounds lovely! For that occasion, I recommend ";
      let recommendedProduct = MOCK_PRODUCTS[0];

      const query = inputText.toLowerCase();
      if (query.includes('wedding') || query.includes('marriage') || query.includes('bride')) {
        recommendedProduct = MOCK_PRODUCTS.find(p => p.id === 'prod-1') || MOCK_PRODUCTS[0];
        botResponseText += `our exquisite **${recommendedProduct.title}** by ${recommendedProduct.storeName}. It features raw silk with heavy zardozi hand embroidery, making it perfect for royal traditional bridal wear.`;
      } else if (query.includes('tux') || query.includes('farewell') || query.includes('suit') || query.includes('formal') || query.includes('men')) {
        recommendedProduct = MOCK_PRODUCTS.find(p => p.id === 'prod-3') || MOCK_PRODUCTS[2];
        botResponseText += `our classic **${recommendedProduct.title}** by ${recommendedProduct.storeName}. Handcrafted with premium Italian Merino wool, it ensures you stand out with sharp sophistication.`;
      } else if (query.includes('party') || query.includes('cocktail') || query.includes('reception') || query.includes('gown')) {
        recommendedProduct = MOCK_PRODUCTS.find(p => p.id === 'prod-2') || MOCK_PRODUCTS[1];
        botResponseText += `the shimmering **${recommendedProduct.title}** by ${recommendedProduct.storeName}. The metallic sequins capture lights beautifully for any cocktail reception.`;
      } else {
        recommendedProduct = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
        botResponseText += `the stunning **${recommendedProduct.title}** from ${recommendedProduct.storeName}, which is a favorite this season!`;
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponseText,
        product: recommendedProduct
      }]);
    }, 1000);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setTryOnPhoto(uploadEvent.target.result);
        setTryOnSuccess(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const runTryOn = () => {
    if (!tryOnPhoto) return;
    setTryOnProcessing(true);
    
    // Simulate AI synthesis mapping
    setTimeout(() => {
      setTryOnProcessing(false);
      setTryOnSuccess(true);
    }, 3000);
  };

  return (
    <>
      {/* Floating Sparkles Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-luxury-gold hover:bg-luxury-bronze text-white p-4 rounded-full shadow-2xl flex items-center justify-center space-x-2 border border-white/20 transition-all duration-300 transform hover:scale-110 active:scale-95 group"
      >
        <Sparkles size={20} className="animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          AI Atelier Stylist
        </span>
      </button>

      {/* Stylist Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fade-in">
          
          {/* Drawer Panel */}
          <div className="w-full max-w-md h-full bg-luxury-alabaster dark:bg-luxury-charcoal shadow-2xl flex flex-col relative border-l border-luxury-gold/20 animate-fade-in-up">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-luxury-gold/20 flex items-center justify-between bg-luxury-charcoal text-white">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-luxury-gold rounded-lg">
                  <Bot size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-playfair text-lg font-semibold tracking-wide">AI Atelier Assistant</h3>
                  <p className="text-[10px] uppercase text-luxury-gold tracking-widest font-semibold">Virtual Try-On & Chat</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs Selector */}
            <div className="flex border-b border-luxury-gold/15 bg-luxury-cream/50 dark:bg-luxury-lightcharcoal">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all ${
                  activeTab === 'chat' 
                    ? 'border-luxury-gold text-luxury-gold bg-white dark:bg-luxury-charcoal' 
                    : 'border-transparent text-luxury-charcoal/50 dark:text-luxury-alabaster/50'
                }`}
              >
                AI Fashion Chatbot
              </button>
              <button
                onClick={() => setActiveTab('tryon')}
                className={`flex-1 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all ${
                  activeTab === 'tryon' 
                    ? 'border-luxury-gold text-luxury-gold bg-white dark:bg-luxury-charcoal' 
                    : 'border-transparent text-luxury-charcoal/50 dark:text-luxury-alabaster/50'
                }`}
              >
                Virtual Try-On
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* Tab 1: Chatbot */}
              {activeTab === 'chat' && (
                <div className="h-full flex flex-col justify-between">
                  <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                    {messages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-start space-x-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <div className={`p-1.5 rounded-full flex-shrink-0 ${msg.sender === 'user' ? 'bg-luxury-gold text-white' : 'bg-luxury-charcoal text-white dark:bg-white dark:text-luxury-charcoal'}`}>
                            {msg.sender === 'user' ? <User size={12} /> : <Bot size={12} />}
                          </div>
                          <div className="space-y-3">
                            <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                              msg.sender === 'user'
                                ? 'bg-luxury-gold text-white rounded-tr-none'
                                : 'bg-white dark:bg-luxury-lightcharcoal text-luxury-charcoal dark:text-luxury-alabaster border border-luxury-gold/10 rounded-tl-none'
                            }`}>
                              {msg.text}
                            </div>
                            
                            {/* Suggested Card */}
                            {msg.product && (
                              <div className="rounded-xl overflow-hidden bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/25 p-2 flex items-center space-x-3 shadow-md animate-fade-in">
                                <img src={msg.product.images[0]} alt={msg.product.title} className="w-14 h-18 object-cover rounded-md flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-[11px] font-semibold truncate dark:text-white">{msg.product.title}</h4>
                                  <p className="text-[9px] text-luxury-gold uppercase font-bold tracking-widest">{msg.product.storeName}</p>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs font-bold dark:text-white">₹{msg.product.rentalPricePerDay}/day</span>
                                    <Link
                                      to={`/product/${msg.product.id}`}
                                      onClick={() => setIsOpen(false)}
                                      className="text-[9px] uppercase tracking-widest font-bold text-luxury-gold hover:text-luxury-bronze"
                                    >
                                      View Outfit
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSendMessage} className="mt-4 flex items-center space-x-2 pt-2 border-t border-luxury-gold/10">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Ask about wedding, party or formal outfits..."
                      className="flex-1 px-4 py-2.5 rounded-full bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/20 dark:text-white text-xs focus:outline-none focus:border-luxury-gold"
                    />
                    <button
                      type="submit"
                      className="p-2.5 bg-luxury-gold text-white rounded-full hover:bg-luxury-bronze transition-colors flex-shrink-0"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                </div>
              )}

              {/* Tab 2: Virtual Try-On */}
              {activeTab === 'tryon' && (
                <div className="space-y-5 text-center flex flex-col h-full justify-between pb-2">
                  <div className="space-y-4">
                    <p className="text-xs text-luxury-charcoal/70 dark:text-luxury-alabaster/70 font-light">
                      Choose an outfit from our catalog, upload your photograph, and let the Paridhan AI engine map the silhouette to your measurements.
                    </p>

                    {/* Outfit Selection Dropdown */}
                    <div className="text-left space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-luxury-gold">1. Select Luxury Outfit</label>
                      <select
                        onChange={(e) => {
                          const match = MOCK_PRODUCTS.find(p => p.id === e.target.value);
                          if (match) setSelectedTryOnProduct(match);
                        }}
                        className="w-full p-2 bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/20 dark:text-white rounded-md text-xs focus:outline-none focus:border-luxury-gold"
                      >
                        {MOCK_PRODUCTS.map(p => (
                          <option key={p.id} value={p.id}>{p.title} ({p.category})</option>
                        ))}
                      </select>
                    </div>

                    {/* Outfit Card Snippet */}
                    <div className="p-2 border border-luxury-gold/10 rounded-lg flex items-center space-x-3 bg-white dark:bg-luxury-lightcharcoal">
                      <img src={selectedTryOnProduct.images[0]} alt="" className="w-10 h-14 object-cover rounded-md" />
                      <div className="text-left min-w-0">
                        <p className="text-[10px] font-bold tracking-widest text-luxury-gold uppercase">{selectedTryOnProduct.storeName}</p>
                        <h4 className="text-xs font-semibold truncate dark:text-white">{selectedTryOnProduct.title}</h4>
                      </div>
                    </div>

                    {/* Photo Uploader */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-luxury-gold">2. Upload Your Portrait Photo</label>
                      
                      {!tryOnPhoto ? (
                        <div className="border border-dashed border-luxury-gold/30 rounded-lg p-6 bg-white dark:bg-luxury-lightcharcoal text-center space-y-3 cursor-pointer relative hover:border-luxury-gold transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <Camera size={24} className="mx-auto text-luxury-gold/60" />
                          <div>
                            <p className="text-xs font-medium dark:text-white">Click to upload photo</p>
                            <p className="text-[9px] text-luxury-charcoal/50 dark:text-luxury-alabaster/50 mt-1">Front facing portrait with neutral background works best</p>
                          </div>
                        </div>
                      ) : (
                        <div className="relative rounded-lg overflow-hidden border border-luxury-gold/20 h-52 bg-luxury-cream">
                          
                          {/* Left: Original Photo */}
                          {!tryOnSuccess ? (
                            <img src={tryOnPhoto} alt="Upload" className="w-full h-full object-cover" />
                          ) : (
                            // Render mapped composition using CSS blend overlays to simulate state
                            <div className="w-full h-full relative">
                              <img src={tryOnPhoto} alt="User" className="absolute inset-0 w-full h-full object-cover filter brightness-90" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                                {/* Composited outfit overlay cutout mock */}
                                <div className="absolute bottom-2 w-36 h-44 rounded-xl border-2 border-luxury-brightgold/80 overflow-hidden shadow-2xl animate-pulse">
                                  <img src={selectedTryOnProduct.images[0]} alt="Outfit Overlay" className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute top-2 right-2 bg-luxury-brightgold text-luxury-charcoal px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest flex items-center">
                                  <CheckCircle size={8} className="mr-1" /> Mapped
                                </div>
                              </div>
                            </div>
                          )}

                          {tryOnProcessing && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center space-y-3 text-white">
                              <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
                              <div>
                                <p className="text-xs font-semibold tracking-wider uppercase text-luxury-gold">Paridhan AI Fitting...</p>
                                <p className="text-[9px] text-white/60 font-light mt-1">Analyzing torso and draping fabric</p>
                              </div>
                            </div>
                          )}

                          {/* Delete Photo Trigger */}
                          <button
                            onClick={() => { setTryOnPhoto(null); setTryOnSuccess(false); }}
                            className="absolute top-2 left-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                          >
                            <X size={12} />
                          </button>

                        </div>
                      )}
                    </div>
                  </div>

                  {/* Trigger Button */}
                  <div className="pt-4 border-t border-luxury-gold/15">
                    {tryOnPhoto && !tryOnSuccess ? (
                      <button
                        onClick={runTryOn}
                        disabled={tryOnProcessing}
                        className="w-full py-3 bg-luxury-charcoal text-white hover:bg-luxury-gold transition-all text-xs font-bold uppercase tracking-widest rounded-md"
                      >
                        Run AI Try-On
                      </button>
                    ) : tryOnSuccess ? (
                      <div className="space-y-3">
                        <div className="p-2.5 bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 rounded-md text-[11px] font-medium flex items-center justify-center">
                          <CheckCircle size={14} className="mr-2" /> Fitting synthesized successfully!
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setTryOnSuccess(false)}
                            className="flex-1 py-2.5 border border-luxury-gold text-luxury-gold hover:bg-luxury-cream transition-all text-[10px] font-bold uppercase tracking-widest rounded-md"
                          >
                            Recalibrate
                          </button>
                          <Link
                            to={`/product/${selectedTryOnProduct.id}`}
                            onClick={() => setIsOpen(false)}
                            className="flex-1 py-2.5 bg-luxury-gold text-white text-center hover:bg-luxury-bronze transition-all text-[10px] font-bold uppercase tracking-widest rounded-md"
                          >
                            Rent Outfit Now
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <button
                        disabled
                        className="w-full py-3 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest rounded-md cursor-not-allowed"
                      >
                        Upload photo to begin
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default FloatingCta;
