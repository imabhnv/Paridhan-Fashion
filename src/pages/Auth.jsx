import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';
import SeoHelper from '../components/SeoHelper';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, signup, loginWithGoogle, resetPassword, isAuthenticated, loading: authLoading } = useAuth();

  const redirectDest = searchParams.get('redirect') || '';
  const initialRole = searchParams.get('role') || 'customer';

  // Form control states
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState(initialRole);

  // Boutique signup specific inputs
  const [boutiqueName, setBoutiqueName] = useState('');
  const [boutiqueLocation, setBoutiqueLocation] = useState('');

  // If already authenticated, redirect away
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      redirectUser({ role });
    }
  }, [isAuthenticated, authLoading]);

  // Auto-clear alerts after 6 seconds
  useEffect(() => {
    if (error || info) {
      const timer = setTimeout(() => {
        setError('');
        setInfo('');
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [error, info]);

  // Sync role from URL param
  useEffect(() => {
    if (initialRole) setRole(initialRole);
  }, [initialRole]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setSubmitting(true);

    try {
      if (isForgotPassword) {
        await resetPassword(email);
        setInfo(`Password reset email sent to ${email}. Check your inbox.`);
        setIsForgotPassword(false);
        setSubmitting(false);
        return;
      }

      if (isLogin) {
        const userObj = await login(email, password);
        redirectUser(userObj);
      } else {
        if (!displayName.trim()) {
          setError('Please enter your full name.');
          setSubmitting(false);
          return;
        }
        const userObj = await signup(email, password, displayName.trim(), role, {
          boutiqueName,
          boutiqueLocation,
        });
        redirectUser(userObj);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const userObj = await loginWithGoogle();
      redirectUser(userObj);
    } catch (err) {
      setError(err.message || 'Unable to sign in with Google. Please try again.');
      setGoogleLoading(false);
    }
  };

  const redirectUser = (userObj) => {
    if (redirectDest === 'checkout') {
      navigate('/checkout');
    } else if (userObj?.role === 'admin') {
      navigate('/dashboard/admin');
    } else if (userObj?.role === 'store') {
      navigate('/dashboard/store');
    } else {
      navigate('/dashboard/customer');
    }
  };

  const switchMode = (loginMode) => {
    setIsLogin(loginMode);
    setError('');
    setInfo('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-luxury-cream/20 dark:bg-luxury-charcoal/20 py-16 px-4 relative">

      <SeoHelper
        title="Atelier Portal"
        description="Access your customer or store dashboard at Paridhan luxury fashion rental."
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

        {/* ── RIGHT: Auth panel ── */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto space-y-6">

          <div className="luxury-glass p-8 rounded-2xl border border-luxury-gold/25 shadow-2xl space-y-6">

            {/* Sign In / Create Account Toggle */}
            {!isForgotPassword && (
              <div className="flex border-b border-luxury-gold/15 pb-4">
                <button
                  onClick={() => switchMode(true)}
                  className={`flex-1 text-xs font-bold uppercase tracking-wider text-center pb-2 border-b-2 transition-all ${
                    isLogin
                      ? 'border-luxury-gold text-luxury-gold'
                      : 'border-transparent text-luxury-charcoal/40 dark:text-luxury-alabaster/40'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => switchMode(false)}
                  className={`flex-1 text-xs font-bold uppercase tracking-wider text-center pb-2 border-b-2 transition-all ${
                    !isLogin
                      ? 'border-luxury-gold text-luxury-gold'
                      : 'border-transparent text-luxury-charcoal/40 dark:text-luxury-alabaster/40'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Panel title */}
            <div className="text-center space-y-1">
              <h3 className="font-playfair text-xl font-bold dark:text-white">
                {isForgotPassword ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create Atelier Profile'}
              </h3>
              <p className="text-[10px] text-luxury-charcoal/50 dark:text-luxury-alabaster/50 uppercase tracking-widest font-semibold">
                {isForgotPassword ? 'Atelier recovery' : 'Luxury fashion rental platform'}
              </p>
            </div>

            {/* Error & Info alerts */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 rounded-lg text-xs font-semibold flex items-start space-x-2">
                <ShieldAlert size={14} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            {info && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-700/50 text-amber-700 dark:text-amber-400 rounded-lg text-xs font-semibold flex items-center space-x-2">
                <span className="text-base leading-none">✅</span>
                <span>{info}</span>
              </div>
            )}

            {/* ── AUTH FORM ── */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">

              {/* Name (signup only) */}
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
                    autoComplete={isLogin ? 'email' : 'new-email'}
                    className="w-full pl-9 pr-4 py-2.5 border border-luxury-gold/25 bg-transparent dark:text-white rounded text-xs focus:outline-none focus:border-luxury-gold"
                  />
                  <Mail className="absolute left-3 top-3 text-luxury-gold/40" size={14} />
                </div>
              </div>

              {/* Password (not on forgot password) */}
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
                      autoComplete={isLogin ? 'current-password' : 'new-password'}
                      minLength={6}
                      className="w-full pl-9 pr-4 py-2.5 border border-luxury-gold/25 bg-transparent dark:text-white rounded text-xs focus:outline-none focus:border-luxury-gold"
                    />
                    <Lock className="absolute left-3 top-3 text-luxury-gold/40" size={14} />
                  </div>
                  {!isLogin && (
                    <p className="text-[9px] text-luxury-charcoal/40 dark:text-luxury-alabaster/40 mt-1">
                      Minimum 6 characters
                    </p>
                  )}
                </div>
              )}

              {/* Role & Boutique details (signup only) */}
              {!isLogin && !isForgotPassword && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-1 text-left">
                    <span className="text-[9px] uppercase font-bold text-luxury-gold block">Register As</span>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setRole('customer')}
                        className={`flex-1 py-2 text-xs font-semibold rounded border transition-all ${
                          role === 'customer'
                            ? 'bg-luxury-gold border-luxury-gold text-white'
                            : 'border-luxury-gold/20 dark:text-white hover:border-luxury-gold/50'
                        }`}
                      >
                        🛍️ Customer
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('store')}
                        className={`flex-1 py-2 text-xs font-semibold rounded border transition-all ${
                          role === 'store'
                            ? 'bg-luxury-gold border-luxury-gold text-white'
                            : 'border-luxury-gold/20 dark:text-white hover:border-luxury-gold/50'
                        }`}
                      >
                        🏪 Boutique
                      </button>
                    </div>
                  </div>

                  {role === 'store' && (
                    <div className="space-y-3 animate-slide-up p-4 border border-luxury-gold/20 rounded-xl bg-luxury-gold/5">
                      <p className="text-[9px] uppercase font-bold text-luxury-gold tracking-wider">
                        ✦ Boutique Details
                      </p>
                      <div className="space-y-1 text-left">
                        <span className="text-[9px] uppercase font-bold text-luxury-gold">Boutique Brand Name</span>
                        <input
                          type="text"
                          required
                          value={boutiqueName}
                          onChange={(e) => setBoutiqueName(e.target.value)}
                          placeholder="e.g. Anita Dongre Juhu Room"
                          className="w-full px-4 py-2.5 border border-luxury-gold/25 bg-transparent dark:text-white rounded text-xs focus:outline-none focus:border-luxury-gold"
                        />
                      </div>
                      <div className="space-y-1 text-left">
                        <span className="text-[9px] uppercase font-bold text-luxury-gold">Showroom Location</span>
                        <input
                          type="text"
                          required
                          value={boutiqueLocation}
                          onChange={(e) => setBoutiqueLocation(e.target.value)}
                          placeholder="e.g. Colaba, Mumbai"
                          className="w-full px-4 py-2.5 border border-luxury-gold/25 bg-transparent dark:text-white rounded text-xs focus:outline-none focus:border-luxury-gold"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Forgot password link */}
              {isLogin && !isForgotPassword && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-[10px] uppercase font-semibold tracking-wider text-luxury-gold hover:text-luxury-bronze transition-colors"
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
                    className="text-[10px] uppercase font-semibold tracking-wider text-luxury-gold hover:text-luxury-bronze transition-colors"
                  >
                    ← Back to login
                  </button>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                id="auth-submit-btn"
                disabled={submitting}
                className="w-full py-3.5 bg-luxury-charcoal text-white hover:bg-luxury-gold dark:bg-luxury-gold dark:text-luxury-charcoal dark:hover:bg-luxury-bronze transition-colors text-xs font-bold uppercase tracking-widest rounded-md flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Please wait...</span>
                  </>
                ) : (
                  <span>
                    {isForgotPassword
                      ? 'Send Recovery Email'
                      : isLogin
                      ? 'Sign In to Atelier'
                      : 'Create Profile'}
                  </span>
                )}
              </button>
            </form>

            {/* Google Sign-In */}
            {!isForgotPassword && (
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2 text-[10px] text-luxury-charcoal/30 dark:text-luxury-alabaster/30 uppercase tracking-widest font-semibold">
                  <div className="h-px flex-1 bg-luxury-gold/20" />
                  <span>or continue with</span>
                  <div className="h-px flex-1 bg-luxury-gold/20" />
                </div>

                <button
                  id="google-login-btn"
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                  className="w-full py-3 border border-luxury-gold/30 hover:border-luxury-gold bg-white/50 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/20 text-luxury-charcoal dark:text-luxury-alabaster transition-all text-xs font-semibold rounded-md flex items-center justify-center space-x-2.5 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {googleLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-luxury-gold" />
                      <span>Connecting to Google...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
                        <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z" />
                        <path fill="#4A90D9" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z" />
                        <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" />
                      </svg>
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>

                {/* Phone OTP — Coming Soon */}
                <div className="w-full py-2.5 border border-dashed border-luxury-gold/20 rounded-md flex items-center justify-center space-x-2 text-[10px] text-luxury-charcoal/35 dark:text-luxury-alabaster/30 font-semibold uppercase tracking-wider">
                  <span>📱</span>
                  <span>Phone OTP Login — Coming Soon</span>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;
