import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Key, ShieldAlert, Sparkles } from 'lucide-react';
import SeoHelper from '../components/SeoHelper';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, signup, loginWithGoogle, resetPassword } = useAuth();

  const redirectDest = searchParams.get('redirect') || '';
  const initialRole = searchParams.get('role') || 'customer';

  // Forms control states
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  
  // Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState(initialRole);
  
  // Boutique signup specific inputs
  const [boutiqueName, setBoutiqueName] = useState('');
  const [boutiqueLocation, setBoutiqueLocation] = useState('');

  // Handle errors / alerts timer
  useEffect(() => {
    if (error || info) {
      const timer = setTimeout(() => {
        setError('');
        setInfo('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, info]);

  // Handle Dynamic roles query
  useEffect(() => {
    if (initialRole) {
      setRole(initialRole);
    }
  }, [initialRole]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    try {
      if (isForgotPassword) {
        await resetPassword(email);
        setInfo(`Simulated reset email sent to ${email}`);
        setIsForgotPassword(false);
        return;
      }

      if (isLogin) {
        const userObj = await login(email, password);
        redirectUser(userObj);
      } else {
        const userObj = await signup(email, password, displayName, role, {
          boutiqueName,
          boutiqueLocation
        });
        redirectUser(userObj);
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please verify credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const userObj = await loginWithGoogle();
      redirectUser(userObj);
    } catch (err) {
      setError(err.message || "Failed to authenticate with Google.");
    }
  };

  const redirectUser = (userObj) => {
    if (redirectDest === 'checkout') {
      navigate('/checkout');
    } else {
      if (userObj.role === 'admin') {
        navigate('/dashboard/admin');
      } else if (userObj.role === 'store') {
        navigate('/dashboard/store');
      } else {
        navigate('/dashboard/customer');
      }
    }
  };

  // Instant Credential Helper Autofills
  const handleQuickLogin = async (roleType) => {
    let qEmail = '';
    const qPass = 'password123';
    
    if (roleType === 'customer') {
      qEmail = 'customer@paridhan.com';
    } else if (roleType === 'store') {
      qEmail = 'boutique@paridhan.com';
    } else if (roleType === 'admin') {
      qEmail = 'admin@paridhan.com';
    }

    setEmail(qEmail);
    setPassword(qPass);
    setIsLogin(true);
    setIsForgotPassword(false);

    try {
      const userObj = await login(qEmail, qPass);
      redirectUser(userObj);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-luxury-cream/20 dark:bg-luxury-charcoal/20 py-16 px-4 relative">
      
      <SeoHelper title="Atelier Portal" description="Access your customer or store dashboard at Paridhan luxury fashion rental." />

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-luxury-gold/5 filter blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-luxury-gold/5 filter blur-2xl"></div>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* LEFT COLUMN: Premium startup pitch */}
        <div className="lg:col-span-6 text-left space-y-6 hidden lg:block pr-8">
          <div className="inline-flex items-center space-x-2 bg-luxury-gold/15 border border-luxury-gold/30 px-3.5 py-1.5 rounded-full">
            <Sparkles size={12} className="text-luxury-gold" />
            <span className="text-[9px] uppercase font-bold tracking-widest text-luxury-gold">
              Welcome to the Paridhan Club
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-semibold font-playfair tracking-tight leading-tight dark:text-white">
            Unlock the World's Finest <span className="text-gold-gradient font-bold italic">Designer Closet</span>
          </h2>
          <p className="text-sm font-light text-luxury-charcoal/70 dark:text-luxury-alabaster/70 leading-relaxed">
            By joining Paridhan, customers gain access to premium luxury bridal wear, lehengas, sherwanis, and tuxedos, while boutiques monetize idle, valuable inventory.
          </p>

          <div className="space-y-4 pt-4 border-t border-luxury-gold/15 max-w-md text-xs font-light text-luxury-charcoal/60 dark:text-luxury-alabaster/60 leading-relaxed">
            <p>✓ UV-C Sanitization packaging standard SLA</p>
            <p>✓ Multi-city delivery & pickup network coordination</p>
            <p>✓ Security deposits refunded to card source within 48hr</p>
          </div>
        </div>

        {/* RIGHT COLUMN: The Auth panel card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto space-y-6">
          
          <div className="luxury-glass p-8 rounded-2xl border border-luxury-gold/25 shadow-2xl space-y-6">
            
            {/* Form Toggle buttons */}
            {!isForgotPassword && (
              <div className="flex border-b border-luxury-gold/15 pb-4">
                <button
                  onClick={() => { setIsLogin(true); setError(''); }}
                  className={`flex-1 text-xs font-bold uppercase tracking-wider text-center pb-2 border-b-2 transition-all ${
                    isLogin ? 'border-luxury-gold text-luxury-gold' : 'border-transparent text-luxury-charcoal/40 dark:text-luxury-alabaster/40'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setIsLogin(false); setError(''); }}
                  className={`flex-1 text-xs font-bold uppercase tracking-wider text-center pb-2 border-b-2 transition-all ${
                    !isLogin ? 'border-luxury-gold text-luxury-gold' : 'border-transparent text-luxury-charcoal/40 dark:text-luxury-alabaster/40'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            <div className="text-center space-y-1">
              <h3 className="font-playfair text-xl font-bold dark:text-white">
                {isForgotPassword 
                  ? "Reset Password" 
                  : isLogin 
                    ? "Welcome Back" 
                    : "Create Atelier Profile"
                }
              </h3>
              <p className="text-[10px] text-luxury-charcoal/50 dark:text-luxury-alabaster/50 uppercase tracking-widest font-semibold">
                {isForgotPassword ? "Atelier recovery" : "Luxury fashion rental platform"}
              </p>
            </div>

            {/* Error & Info alerts */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-xs font-semibold flex items-center space-x-2">
                <ShieldAlert size={14} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {info && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded text-xs font-semibold">
                {info}
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              
              {/* Name field (Only on signup) */}
              {!isLogin && !isForgotPassword && (
                <div className="space-y-1 text-left">
                  <span className="text-[9px] uppercase font-bold text-luxury-gold">Your Full Name</span>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Devi Prasad"
                      className="w-full pl-9 pr-4 py-2.5 border border-luxury-gold/25 bg-transparent dark:text-white rounded text-xs focus:outline-none focus:border-luxury-gold"
                    />
                    <User className="absolute left-3 top-3 text-luxury-gold/40" size={14} />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1 text-left">
                <span className="text-[9px] uppercase font-bold text-luxury-gold">Email Address</span>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full pl-9 pr-4 py-2.5 border border-luxury-gold/25 bg-transparent dark:text-white rounded text-xs focus:outline-none focus:border-luxury-gold"
                  />
                  <Mail className="absolute left-3 top-3 text-luxury-gold/40" size={14} />
                </div>
              </div>

              {/* Password (Hide on forgot password) */}
              {!isForgotPassword && (
                <div className="space-y-1 text-left">
                  <span className="text-[9px] uppercase font-bold text-luxury-gold">Password</span>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-4 py-2.5 border border-luxury-gold/25 bg-transparent dark:text-white rounded text-xs focus:outline-none focus:border-luxury-gold"
                    />
                    <Lock className="absolute left-3 top-3 text-luxury-gold/40" size={14} />
                  </div>
                </div>
              )}

              {/* Role Selection & Boutique name details (Only on Signup) */}
              {!isLogin && !isForgotPassword && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-1 text-left">
                    <span className="text-[9px] uppercase font-bold text-luxury-gold block">Register Profile Role</span>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setRole('customer')}
                        className={`flex-1 py-2 text-xs font-semibold rounded border transition-all ${
                          role === 'customer' 
                            ? 'bg-luxury-gold border-luxury-gold text-white' 
                            : 'border-luxury-gold/20 dark:text-white'
                        }`}
                      >
                        Rent Outfits (Customer)
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('store')}
                        className={`flex-1 py-2 text-xs font-semibold rounded border transition-all ${
                          role === 'store' 
                            ? 'bg-luxury-gold border-luxury-gold text-white' 
                            : 'border-luxury-gold/20 dark:text-white'
                        }`}
                      >
                        List Stores (Boutique)
                      </button>
                    </div>
                  </div>

                  {role === 'store' && (
                    <div className="space-y-3 animate-slide-up">
                      <div className="space-y-1 text-left">
                        <span className="text-[9px] uppercase font-bold text-luxury-gold">Boutique Brand Name</span>
                        <input
                          type="text"
                          required
                          value={boutiqueName}
                          onChange={(e) => setBoutiqueName(e.target.value)}
                          placeholder="Anita Dongre Juhu Room..."
                          className="w-full px-4 py-2.5 border border-luxury-gold/25 bg-transparent dark:text-white rounded text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1 text-left">
                        <span className="text-[9px] uppercase font-bold text-luxury-gold">Showroom Location</span>
                        <input
                          type="text"
                          required
                          value={boutiqueLocation}
                          onChange={(e) => setBoutiqueLocation(e.target.value)}
                          placeholder="Colaba, Mumbai..."
                          className="w-full px-4 py-2.5 border border-luxury-gold/25 bg-transparent dark:text-white rounded text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Forgot password toggle link */}
              {isLogin && !isForgotPassword && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-[10px] uppercase font-semibold tracking-wider text-luxury-gold hover:text-luxury-bronze"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {isForgotPassword && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(false)}
                    className="text-[10px] uppercase font-semibold tracking-wider text-luxury-gold hover:text-luxury-bronze"
                  >
                    Back to login
                  </button>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 bg-luxury-charcoal text-white hover:bg-luxury-gold dark:bg-luxury-gold dark:text-luxury-charcoal dark:hover:bg-luxury-cream transition-colors text-xs font-bold uppercase tracking-widest rounded-md"
              >
                {isForgotPassword 
                  ? "Send Recovery Mail" 
                  : isLogin 
                    ? "Log In to Atelier" 
                    : "Create Profile"
                }
              </button>

            </form>

            {/* Google authentication section */}
            {!isForgotPassword && (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-[10px] text-luxury-charcoal/30 uppercase tracking-widest font-semibold">
                  <div className="h-px w-10 bg-luxury-gold/20"></div>
                  <span>or</span>
                  <div className="h-px w-10 bg-luxury-gold/20"></div>
                </div>

                <button
                  onClick={handleGoogleLogin}
                  className="w-full py-3 border border-luxury-gold/30 hover:border-luxury-gold text-luxury-charcoal dark:text-luxury-alabaster hover:text-luxury-gold transition-colors text-xs font-semibold uppercase tracking-widest rounded-md flex items-center justify-center space-x-2.5"
                >
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.5 5.5 0 018.5 13a5.5 5.5 0 015.491-5.518c2.4 0 4.218 1.409 5.064 2.873l3.636-3.636C20.45 4.364 17.5 2 13.991 2 7.92 2 3 6.92 3 13s4.92 11 10.991 11c6.282 0 10.973-4.418 10.973-11 0-.745-.091-1.345-.245-1.715H12.24z"/>
                  </svg>
                  <span>Access via Google</span>
                </button>
              </div>
            )}

          </div>

          {/* FAST LOGIN ASSISTANT DEVELOPER CARD */}
          <div className="p-5 border border-dashed border-luxury-gold/40 rounded-xl bg-luxury-cream/15 text-left space-y-3">
            <span className="font-semibold text-xs text-luxury-gold uppercase tracking-wider flex items-center">
              <Key size={14} className="mr-1.5" /> Fast Demo Access Dashboard
            </span>
            <p className="text-[10px] text-luxury-charcoal/60 dark:text-luxury-alabaster/60 font-light leading-relaxed">
              Skip registration! Select a workspace profile below to log in automatically with pre-seeded demo properties.
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleQuickLogin('customer')}
                className="py-2 bg-luxury-charcoal text-white hover:bg-luxury-gold rounded text-[9px] font-bold uppercase tracking-wider transition-colors text-center"
              >
                Customer
              </button>
              <button
                onClick={() => handleQuickLogin('store')}
                className="py-2 bg-luxury-charcoal text-white hover:bg-luxury-gold rounded text-[9px] font-bold uppercase tracking-wider transition-colors text-center"
              >
                Boutique
              </button>
              <button
                onClick={() => handleQuickLogin('admin')}
                className="py-2 bg-luxury-charcoal text-white hover:bg-luxury-gold rounded text-[9px] font-bold uppercase tracking-wider transition-colors text-center text-ellipsis overflow-hidden"
              >
                Admin
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Auth;
