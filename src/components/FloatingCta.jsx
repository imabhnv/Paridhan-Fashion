import React, { useState } from 'react';
import { Sparkles, Bot, User, Send, X } from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/mockData';
import { Link } from 'react-router-dom';

const FloatingCta = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Namaste! I'm your Paridhan Outfit Advisor. Tell me what occasion you're planning for and I'll suggest the perfect designer outfit.",
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: inputText };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Rule-based outfit suggestions based on keywords
    setTimeout(() => {
      let botText = 'That sounds wonderful! Based on your occasion, here is our top suggestion — ';
      let recommendedProduct = MOCK_PRODUCTS[0];

      const q = inputText.toLowerCase();
      if (q.includes('wedding') || q.includes('marriage') || q.includes('bride')) {
        recommendedProduct = MOCK_PRODUCTS.find((p) => p.id === 'prod-1') || MOCK_PRODUCTS[0];
        botText += `our **${recommendedProduct.title}** by ${recommendedProduct.storeName}. It features raw silk with heavy zardozi hand embroidery — perfect for royal bridal wear.`;
      } else if (q.includes('tux') || q.includes('suit') || q.includes('formal') || q.includes('farewell') || q.includes('men') || q.includes('groom')) {
        recommendedProduct = MOCK_PRODUCTS.find((p) => p.id === 'prod-3') || MOCK_PRODUCTS[2];
        botText += `our **${recommendedProduct.title}** by ${recommendedProduct.storeName}. Handcrafted with premium Merino wool — sharp and sophisticated.`;
      } else if (q.includes('party') || q.includes('cocktail') || q.includes('reception') || q.includes('gown')) {
        recommendedProduct = MOCK_PRODUCTS.find((p) => p.id === 'prod-2') || MOCK_PRODUCTS[1];
        botText += `the **${recommendedProduct.title}** by ${recommendedProduct.storeName}. The metallic sequins capture light beautifully for any cocktail event.`;
      } else if (q.includes('sangeet') || q.includes('mehendi') || q.includes('haldi') || q.includes('festival')) {
        recommendedProduct = MOCK_PRODUCTS.find((p) => p.id === 'prod-4') || MOCK_PRODUCTS[3];
        botText += `our **${recommendedProduct.title}** by ${recommendedProduct.storeName}. Light organza with hand-painted florals — ideal for daytime celebrations.`;
      } else if (q.includes('sherwani') || q.includes('ethnic') || q.includes('kurta')) {
        recommendedProduct = MOCK_PRODUCTS.find((p) => p.id === 'prod-5') || MOCK_PRODUCTS[4];
        botText += `our **${recommendedProduct.title}** by ${recommendedProduct.storeName}. Premium Banarasi silk with classic bandhgala — elegance personified.`;
      } else {
        recommendedProduct = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
        botText += `the **${recommendedProduct.title}** from ${recommendedProduct.storeName} — a favorite choice this season!`;
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', text: botText, product: recommendedProduct },
      ]);
    }, 900);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-luxury-gold hover:bg-luxury-bronze text-white p-4 rounded-full shadow-2xl flex items-center justify-center space-x-2 border border-white/20 transition-all duration-300 transform hover:scale-110 active:scale-95 group"
        aria-label="Open Outfit Advisor"
      >
        <Sparkles size={20} className="animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Outfit Advisor
        </span>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-fade-in">

          {/* Backdrop click to close */}
          <div className="flex-1" onClick={() => setIsOpen(false)} />

          {/* Drawer Panel */}
          <div className="w-full max-w-md h-full bg-luxury-alabaster dark:bg-luxury-charcoal shadow-2xl flex flex-col relative border-l border-luxury-gold/20 animate-fade-in-up">

            {/* Header */}
            <div className="p-5 border-b border-luxury-gold/20 flex items-center justify-between bg-luxury-charcoal text-white flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-luxury-gold rounded-lg">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-playfair text-base font-semibold tracking-wide">
                    Outfit Advisor
                  </h3>
                  <p className="text-[9px] uppercase text-luxury-gold/80 tracking-widest font-semibold">
                    Rule-based fashion suggestions
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Notice banner */}
            <div className="px-4 py-2 bg-luxury-gold/10 border-b border-luxury-gold/15 flex-shrink-0">
              <p className="text-[9px] text-luxury-charcoal/60 dark:text-luxury-alabaster/60 font-medium text-center">
                💡 Suggestions are based on curated fashion rules, not AI
              </p>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[85%] ${
                      msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-full flex-shrink-0 ${
                        msg.sender === 'user'
                          ? 'bg-luxury-gold text-white'
                          : 'bg-luxury-charcoal text-white dark:bg-white dark:text-luxury-charcoal'
                      }`}
                    >
                      {msg.sender === 'user' ? <User size={11} /> : <Bot size={11} />}
                    </div>
                    <div className="space-y-2.5">
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-luxury-gold text-white rounded-tr-none'
                            : 'bg-white dark:bg-luxury-lightcharcoal text-luxury-charcoal dark:text-luxury-alabaster border border-luxury-gold/10 rounded-tl-none'
                        }`}
                      >
                        {msg.text}
                      </div>

                      {/* Product suggestion card */}
                      {msg.product && (
                        <div className="rounded-xl overflow-hidden bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/25 p-2.5 flex items-center space-x-3 shadow-md animate-fade-in">
                          <img
                            src={msg.product.images[0]}
                            alt={msg.product.title}
                            className="w-14 h-[72px] object-cover rounded-md flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] text-luxury-gold uppercase font-bold tracking-widest">
                              {msg.product.storeName}
                            </p>
                            <h4 className="text-[11px] font-semibold truncate dark:text-white mt-0.5">
                              {msg.product.title}
                            </h4>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs font-bold dark:text-white">
                                ₹{msg.product.rentalPricePerDay.toLocaleString()}/day
                              </span>
                              <Link
                                to={`/product/${msg.product.id}`}
                                onClick={() => setIsOpen(false)}
                                className="text-[9px] uppercase tracking-widest font-bold text-luxury-gold hover:text-luxury-bronze transition-colors"
                              >
                                View →
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

            {/* Virtual Try-On — Coming Soon Banner */}
            <div className="px-4 py-2.5 border-t border-luxury-gold/10 bg-luxury-cream/30 dark:bg-luxury-lightcharcoal/30 flex-shrink-0">
              <div className="flex items-center justify-center gap-2 text-[9px] uppercase tracking-wider font-semibold text-luxury-charcoal/40 dark:text-luxury-alabaster/30">
                <span>📷</span>
                <span>Virtual Try-On — Coming Soon</span>
              </div>
            </div>

            {/* Input Form */}
            <div className="p-4 border-t border-luxury-gold/15 flex-shrink-0">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="e.g. Wedding reception, bridal lehenga..."
                  className="flex-1 px-4 py-2.5 rounded-full bg-white dark:bg-luxury-lightcharcoal border border-luxury-gold/20 dark:text-white text-xs focus:outline-none focus:border-luxury-gold transition-colors"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-luxury-gold text-white rounded-full hover:bg-luxury-bronze transition-colors flex-shrink-0"
                  aria-label="Send"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default FloatingCta;
