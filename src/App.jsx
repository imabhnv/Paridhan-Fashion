import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';

// Core layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingCta from './components/FloatingCta';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Tracking from './pages/Tracking';
import Auth from './pages/Auth';
import CustomerDashboard from './pages/CustomerDashboard';
import StoreDashboard from './pages/StoreDashboard';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import TrustPages from './pages/TrustPages';

// Scroll to top helper on page transitions
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen text-luxury-charcoal dark:text-luxury-alabaster bg-luxury-alabaster dark:bg-luxury-lightcharcoal transition-colors duration-300">
              
              {/* Premium Navigation Header */}
              <Navbar />

              {/* Page Route Definitions */}
              <main className="flex-grow">
                <Routes>
                  {/* Public Pages */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  
                  {/* Trust Policies Routing */}
                  <Route path="/trust" element={<TrustPages />} />
                  <Route path="/trust/:policyName" element={<TrustPages />} />

                  {/* Protected Checkout & Tracking Flows */}
                  <Route 
                    path="/checkout" 
                    element={
                      <ProtectedRoute allowedRoles={['customer', 'store', 'admin']}>
                        <Checkout />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/order-confirmation/:id" 
                    element={
                      <ProtectedRoute allowedRoles={['customer', 'store', 'admin']}>
                        <OrderConfirmation />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/tracking/:id" 
                    element={
                      <ProtectedRoute allowedRoles={['customer', 'store', 'admin']}>
                        <Tracking />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Dashboards Routing */}
                  <Route 
                    path="/dashboard/customer" 
                    element={
                      <ProtectedRoute allowedRoles={['customer', 'admin']}>
                        <CustomerDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard/store" 
                    element={
                      <ProtectedRoute allowedRoles={['store', 'admin']}>
                        <StoreDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard/admin" 
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Catch-all fallback redirect to home */}
                  <Route path="*" element={<Landing />} />
                </Routes>
              </main>

              {/* Premium Footer */}
              <Footer />

              {/* Floating AI Assistant Concierge Stylist */}
              <FloatingCta />

            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
