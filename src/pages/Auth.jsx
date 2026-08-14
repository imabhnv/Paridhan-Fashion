import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Loader2, Sparkles, UserPlus, LogIn, ShoppingBag, User } from 'lucide-react';
import SeoHelper from '../components/SeoHelper';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithGoogle, isAuthenticated, loading: authLoading, logout, setUser } = useAuth();

  const redirectDest = searchParams.get('redirect') || '';

  const [activeTab, setActiveTab] = useState('signin'); // 'signin' or 'signup'
  const [registerRole, setRegisterRole] = useState('customer'); // 'customer' or 'store'
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  // If already authenticated, redirect away
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      redirectUser();
    }
  }, [isAuthenticated, authLoading]);

  const handleGoogleAuth = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      // Pass the selected role. If they are signing in, it will be ignored by auth.js for existing profiles.
      const userObj = await loginWithGoogle(activeTab === 'signup' ? registerRole : 'customer');
      
      // Enforce tab logic: remember if user is new or not
      if (activeTab === 'signin' && userObj.isNewUser) {
        // User tried to sign in but didn't have an account
        await logout(); // Undo the login
        setError('No account found with this Google email. Please create an account first.');
        setGoogleLoading(false);
        return;
      }
      
      if (activeTab === 'signup' && !userObj.isNewUser) {
        // User tried to sign up but already had an account
        // We'll let them in, but show a welcome back toast/message if we had a toast system
        // For now, we just redirect them as normal, since they are verified.
      }

      // If user is new, we can flag it in local storage to show them an onboarding message later
      if (userObj.isNewUser) {
        localStorage.setItem('paridhan_is_new_user', 'true');
      }

      // Manually update the context immediately to prevent race conditions with onAuthStateChanged
      if (setUser) setUser(userObj);
      redirectUser(userObj);
    } catch (err) {
      setError(err.message || 'Unable to authenticate with Google. Please try again.');
      setGoogleLoading(false);
    }
  };

  const redirectUser = (userObj) => {
    if (redirectDest === 'checkout') return navigate('/checkout');
    if (userObj?.role === 'admin') return navigate('/dashboard/admin');
    if (userObj?.role === 'store') return navigate('/dashboard/store');
    navigate('/dashboard/customer');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-luxury-cream/20 dark:bg-luxury-charcoal/20 py-16 px-4 relative">

      <SeoHelper
        title="Account Access"
        description="Sign in or create an account to access Paridhan — India's luxury fashion rental platform."
      />

      {/* Background glow accents */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-luxury-gold/5 filter blur-2xl" />
        <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-luxury-gold/5 filter blur-2xl" />
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

        {/* ── LEFT: Brand pitch ── */}
        <div className="lg:col-span-6 text-left space-y-6 hidden lg:block pr-8">
          <div className="inline-flex items-center space-x-2 bg-luxury-gold/15 border border-luxury-gold/30 px-3.5 py-1.5 rounded-full">
            <Sparkles size={12} className="text-luxury-gold" />
            <span className="text-[9px] uppercase font-bold tracking-widest text-luxury-gold">
              Welcome to the Paridhan Club
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-semibold font-playfair tracking-tight leading-tight dark:text-white">
            Unlock the World's Finest{' '}
            <span className="text-luxury-gold font-bold italic">Designer Closet</span>
          </h2>
          <p className="text-sm font-light text-luxury-charcoal/70 dark:text-luxury-alabaster/70 leading-relaxed">
            By joining Paridhan, customers gain access to premium luxury bridal wear, lehengas, sherwanis, and tuxedos, while boutiques monetize idle, valuable inventory.
          </p>

          <div className="space-y-3 pt-4 border-t border-luxury-gold/15 max-w-md">
            {[
              'UV-C Sanitization packaging standard SLA',
              'Multi-city delivery & pickup network coordination',
              'Security deposits refunded within 48 hours',
            ].map((item) => (
              <p key={item} className="text-xs font-light text-luxury-charcoal/60 dark:text-luxury-alabaster/60 flex items-start gap-2">
                <span className="text-luxury-gold mt-0.5">✓</span>
                <span>{item}</span>
              </p>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Auth Panel ── */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">

          <div className="luxury-glass p-8 sm:p-10 rounded-2xl border border-luxury-gold/25 shadow-2xl space-y-8 text-center">

            {/* Logo / Icon */}
            <div className="space-y-3 pb-2">
              <div className="flex justify-center items-center space-x-2">
                <span className="text-4xl font-bold tracking-widest font-playfair text-luxury-charcoal dark:text-luxury-alabaster">
                  PARIDHAN
                </span>
                <span className="h-2 w-2 rounded-full bg-luxury-gold inline-block mt-1"></span>
              </div>
              <p className="text-[10px] text-luxury-charcoal/50 dark:text-luxury-alabaster/50 uppercase tracking-widest font-semibold mt-1">
                Luxury Fashion Rental
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-luxury-gold/15 mb-6">
              <button
                onClick={() => { setActiveTab('signin'); setError(''); }}
                className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors border-b-2 flex items-center justify-center gap-2 ${
                  activeTab === 'signin'
                    ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/5'
                    : 'border-transparent text-luxury-charcoal/40 dark:text-luxury-alabaster/40 hover:text-luxury-charcoal dark:hover:text-white'
                }`}
              >
                <LogIn size={14} /> SIGN IN
              </button>
              <button
                onClick={() => { setActiveTab('signup'); setError(''); }}
                className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors border-b-2 flex items-center justify-center gap-2 ${
                  activeTab === 'signup'
                    ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/5'
                    : 'border-transparent text-luxury-charcoal/40 dark:text-luxury-alabaster/40 hover:text-luxury-charcoal dark:hover:text-white'
                }`}
              >
                <UserPlus size={14} /> CREATE ACCOUNT
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 rounded-lg text-xs font-semibold flex items-start space-x-2 text-left">
                <ShieldAlert size={14} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Role Selection (Only shown on Create Account) */}
            {activeTab === 'signup' && (
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-luxury-charcoal/50 dark:text-luxury-alabaster/50 text-left">I want to register as a...</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setRegisterRole('customer')}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-semibold transition-all ${
                      registerRole === 'customer'
                        ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold'
                        : 'border-luxury-gold/20 hover:border-luxury-gold/50 text-luxury-charcoal/60 dark:text-luxury-alabaster/60'
                    }`}
                  >
                    <User size={20} className="mb-2" />
                    Customer
                  </button>
                  <button
                    onClick={() => setRegisterRole('store')}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-semibold transition-all ${
                      registerRole === 'store'
                        ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold'
                        : 'border-luxury-gold/20 hover:border-luxury-gold/50 text-luxury-charcoal/60 dark:text-luxury-alabaster/60'
                    }`}
                  >
                    <ShoppingBag size={20} className="mb-2" />
                    Boutique
                  </button>
                </div>
              </div>
            )}

            {/* Google Auth Button */}
            <div className="space-y-4">
              <p className="text-xs text-luxury-charcoal/60 dark:text-luxury-alabaster/60 font-light">
                {activeTab === 'signin' 
                  ? 'Sign in securely using your Google account.' 
                  : 'Create a new Paridhan account instantly with Google.'}
                <br />
                No password required.
              </p>

              <button
                id="google-login-btn"
                type="button"
                onClick={handleGoogleAuth}
                disabled={googleLoading}
                className="w-full py-4 border border-luxury-gold/30 hover:border-luxury-gold bg-white/60 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-luxury-charcoal dark:text-luxury-alabaster transition-all text-sm font-semibold rounded-xl flex items-center justify-center space-x-3 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {googleLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-luxury-gold" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
                      <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z" />
                      <path fill="#4A90D9" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z" />
                      <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" />
                    </svg>
                    <span>{activeTab === 'signin' ? 'Sign In with Google' : 'Create Account with Google'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Footer note */}
            <p className="text-[9px] text-luxury-charcoal/35 dark:text-luxury-alabaster/30 leading-relaxed pt-4">
              By continuing, you agree to Paridhan's{' '}
              <a href="/trust/terms" className="underline underline-offset-2 hover:text-luxury-gold transition-colors">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/trust/privacy" className="underline underline-offset-2 hover:text-luxury-gold transition-colors">
                Privacy Policy
              </a>
              .
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;
