import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { 
  ShoppingBag, Heart, Sun, Moon, User, Menu, X, Shield, LayoutDashboard, LogOut
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cart, wishlist } = useCart();
  const { darkMode, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/auth';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'store') return '/dashboard/store';
    return '/dashboard/customer';
  };

  return (
    <nav className="sticky top-0 z-50 transition-all duration-300 backdrop-blur-md border-b border-luxury-gold/20 bg-luxury-alabaster/80 dark:bg-luxury-charcoal/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-3xl font-bold tracking-widest font-playfair text-luxury-charcoal dark:text-luxury-alabaster">
                PARIDHAN
              </span>
              <span className="h-2 w-2 rounded-full bg-luxury-gold inline-block"></span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium tracking-wider uppercase text-luxury-charcoal/80 hover:text-luxury-gold dark:text-luxury-alabaster/80 dark:hover:text-luxury-gold transition-colors">
              Home
            </Link>
            <Link to="/catalog" className="text-sm font-medium tracking-wider uppercase text-luxury-charcoal/80 hover:text-luxury-gold dark:text-luxury-alabaster/80 dark:hover:text-luxury-gold transition-colors">
              Catalog
            </Link>
            <Link to="/about" className="text-sm font-medium tracking-wider uppercase text-luxury-charcoal/80 hover:text-luxury-gold dark:text-luxury-alabaster/80 dark:hover:text-luxury-gold transition-colors">
              About Us
            </Link>
            <Link to="/blog" className="text-sm font-medium tracking-wider uppercase text-luxury-charcoal/80 hover:text-luxury-gold dark:text-luxury-alabaster/80 dark:hover:text-luxury-gold transition-colors">
              Blog
            </Link>
            <Link to="/contact" className="text-sm font-medium tracking-wider uppercase text-luxury-charcoal/80 hover:text-luxury-gold dark:text-luxury-alabaster/80 dark:hover:text-luxury-gold transition-colors">
              Contact
            </Link>
          </div>

          {/* User Controls / Utility Icons */}
          <div className="hidden md:flex items-center space-x-6">
            
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleTheme} 
              className="p-2 text-luxury-charcoal hover:text-luxury-gold dark:text-luxury-alabaster dark:hover:text-luxury-gold transition-colors"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Wishlist Link */}
            <Link 
              to={isAuthenticated ? "/dashboard/customer?tab=wishlist" : "/auth"} 
              className="relative p-2 text-luxury-charcoal hover:text-luxury-gold dark:text-luxury-alabaster dark:hover:text-luxury-gold transition-colors"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-luxury-gold text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link 
              to="/cart" 
              className="relative p-2 text-luxury-charcoal hover:text-luxury-gold dark:text-luxury-alabaster dark:hover:text-luxury-gold transition-colors"
            >
              <ShoppingBag size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-luxury-charcoal dark:bg-luxury-gold text-white dark:text-luxury-charcoal text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* User Dropdown Profile Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="h-9 w-9 rounded-full border border-luxury-gold object-cover shadow-sm"
                    />
                    <span className="text-sm font-medium text-luxury-charcoal dark:text-luxury-alabaster hover:text-luxury-gold">
                      {user.displayName.split(' ')[0]}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 rounded-md shadow-2xl py-1 bg-white dark:bg-luxury-charcoal border border-luxury-gold/20 backdrop-blur-lg focus:outline-none animate-fade-in">
                      <div className="px-4 py-2.5 border-b border-luxury-gold/10">
                        <p className="text-xs font-semibold uppercase text-luxury-gold tracking-wider">Signed in as</p>
                        <p className="text-sm font-medium text-luxury-charcoal dark:text-luxury-alabaster truncate">{user.email}</p>
                        <p className="text-[10px] mt-1 inline-block bg-luxury-gold/20 text-luxury-bronze px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                          {user.role}
                        </p>
                      </div>
                      
                      <Link
                        to={getDashboardLink()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-3 text-sm text-luxury-charcoal hover:bg-luxury-cream dark:text-luxury-alabaster dark:hover:bg-luxury-lightcharcoal transition-colors"
                      >
                        <LayoutDashboard size={16} className="mr-3 text-luxury-gold" />
                        Dashboard
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-3 text-sm text-left text-red-600 hover:bg-luxury-cream dark:hover:bg-luxury-lightcharcoal transition-colors border-t border-luxury-gold/10"
                      >
                        <LogOut size={16} className="mr-3" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="inline-flex items-center px-5 py-2 border border-luxury-gold/50 rounded-full text-xs font-semibold tracking-widest uppercase bg-transparent hover:bg-luxury-gold hover:text-white dark:text-luxury-alabaster transition-all duration-300"
                >
                  Enter Atelier
                </Link>
              )}
            </div>

          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 text-luxury-charcoal dark:text-luxury-alabaster">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/cart" className="relative p-2 text-luxury-charcoal dark:text-luxury-alabaster">
              <ShoppingBag size={18} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-luxury-gold text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-luxury-charcoal dark:text-luxury-alabaster focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-luxury-gold/15 bg-luxury-alabaster/95 dark:bg-luxury-charcoal/95 h-screen animate-fade-in absolute w-full left-0 z-40 px-6 py-8 flex flex-col space-y-6">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg font-medium tracking-wider text-luxury-charcoal dark:text-luxury-alabaster border-b border-luxury-gold/10 pb-2"
          >
            Home
          </Link>
          <Link
            to="/catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg font-medium tracking-wider text-luxury-charcoal dark:text-luxury-alabaster border-b border-luxury-gold/10 pb-2"
          >
            Catalog
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg font-medium tracking-wider text-luxury-charcoal dark:text-luxury-alabaster border-b border-luxury-gold/10 pb-2"
          >
            About Us
          </Link>
          <Link
            to="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg font-medium tracking-wider text-luxury-charcoal dark:text-luxury-alabaster border-b border-luxury-gold/10 pb-2"
          >
            Blog
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg font-medium tracking-wider text-luxury-charcoal dark:text-luxury-alabaster border-b border-luxury-gold/10 pb-2"
          >
            Contact
          </Link>

          {/* Mobile User controls */}
          {isAuthenticated ? (
            <div className="flex flex-col space-y-4 pt-4">
              <div className="flex items-center space-x-3">
                <img src={user.photoURL} alt={user.displayName} className="h-10 w-10 rounded-full border border-luxury-gold object-cover" />
                <div>
                  <p className="font-semibold text-luxury-charcoal dark:text-luxury-alabaster">{user.displayName}</p>
                  <p className="text-xs text-luxury-gold tracking-wider uppercase font-semibold">{user.role}</p>
                </div>
              </div>
              <Link
                to={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-luxury-gold text-white text-sm font-semibold rounded-full uppercase tracking-wider shadow-md hover:bg-luxury-bronze"
              >
                Dashboard
              </Link>
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="w-full text-center py-2.5 border border-red-500 text-red-500 text-sm font-semibold rounded-full uppercase tracking-wider"
              >
                Log Out
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 bg-luxury-gold text-white text-sm font-semibold rounded-full uppercase tracking-wider shadow-md hover:bg-luxury-bronze"
            >
              Enter Atelier / Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
