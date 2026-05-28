import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('paridhan-cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('paridhan-wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [coupon, setCoupon] = useState(null);
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    localStorage.setItem('paridhan-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('paridhan-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product, size, color, rentalDays, startDate, endDate) => {
    // We only allow one rental item in the cart at a time or multiple. Let's support multiple items!
    // Since outfits can have different rental parameters.
    const cartItem = {
      cartItemId: `${product.id}-${size}-${startDate}`,
      product,
      size,
      color,
      rentalDays: Number(rentalDays),
      startDate,
      endDate,
      // Total rental cost = daily rate * days
      rentalCost: product.rentalPricePerDay * Number(rentalDays),
      securityDeposit: product.securityDeposit
    };
    
    setCart(prev => {
      const existsIdx = prev.findIndex(item => item.cartItemId === cartItem.cartItemId);
      if (existsIdx !== -1) {
        const updated = [...prev];
        updated[existsIdx] = cartItem; // Overwrite
        return updated;
      }
      return [...prev, cartItem];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
    setDiscountPercent(0);
  };

  // Wishlist
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  // Coupon System
  const applyCoupon = (code) => {
    const uppercaseCode = code.toUpperCase();
    if (uppercaseCode === 'WELCOME10') {
      setCoupon('WELCOME10');
      setDiscountPercent(10);
      return { success: true, message: "10% Discount applied successfully!" };
    } else if (uppercaseCode === 'FESTIVE20') {
      setCoupon('FESTIVE20');
      setDiscountPercent(20);
      return { success: true, message: "20% Festive discount applied!" };
    } else if (uppercaseCode === 'LUXRENT30') {
      setCoupon('LUXRENT30');
      setDiscountPercent(30);
      return { success: true, message: "Premium 30% discount applied!" };
    }
    return { success: false, message: "Invalid Coupon Code" };
  };

  const removeCoupon = () => {
    setCoupon(null);
    setDiscountPercent(0);
  };

  // Pricing calculations
  const subtotal = cart.reduce((acc, item) => acc + item.rentalCost, 0);
  const totalSecurityDeposit = cart.reduce((acc, item) => acc + item.securityDeposit, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  // 18% GST (Standard luxury services tax in India)
  const gstAmount = Math.round(((subtotal - discountAmount) * 18) / 100);
  // Service fee (flat ₹250 per rental order for handling & logistics)
  const serviceFee = cart.length > 0 ? 250 : 0;
  // Total payment required = subtotal - discount + GST + Service Fee + Refundable Deposit
  const grandTotal = subtotal - discountAmount + gstAmount + serviceFee + totalSecurityDeposit;

  return (
    <CartContext.Provider value={{
      cart,
      wishlist,
      coupon,
      discountPercent,
      subtotal,
      totalSecurityDeposit,
      discountAmount,
      gstAmount,
      serviceFee,
      grandTotal,
      addToCart,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isInWishlist,
      applyCoupon,
      removeCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
