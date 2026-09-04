import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS } from '../data/products';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // Cart state with LocalStorage persistence
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('kids_fashion_bd_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Wishlist state with LocalStorage persistence
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('kids_fashion_bd_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Currency: 'BDT' or 'USD'
  const [currency, setCurrency] = useState('BDT');
  const USD_RATE = 120; // 1 USD = 120 BDT

  const THEME_KEY = 'kfb_theme_mode_v2';

  // Theme state: 'light' (default is white) or 'dark' (black)
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      return saved === 'dark' ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  });

  const applyThemeToDOM = (themeName) => {
    const isDark = themeName === 'dark';
    const root = document.documentElement;
    const body = document.body;

    if (isDark) {
      root.classList.add('dark');
      if (body) body.classList.add('dark');
      root.style.backgroundColor = '#09090B';
      if (body) body.style.backgroundColor = '#09090B';
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      if (body) body.classList.remove('dark');
      root.style.backgroundColor = '#FFFFFF';
      if (body) body.style.backgroundColor = '#FFFFFF';
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
  };

  const setTheme = (newTheme) => {
    const target = newTheme === 'dark' ? 'dark' : 'light';
    setThemeState(target);
    try {
      localStorage.setItem(THEME_KEY, target);
      localStorage.setItem('kfb_theme_mode', target);
      localStorage.setItem('kfb_theme', target);
    } catch (e) {}
    applyThemeToDOM(target);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    applyThemeToDOM(theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
      localStorage.setItem('kfb_theme_mode', theme);
      localStorage.setItem('kfb_theme', theme);
    } catch (e) {}
  }, [theme]);

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeQuickView, setActiveQuickView] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedSort, setSelectedSort] = useState('featured');

  // Promo code
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [deliveryRegion, setDeliveryRegion] = useState('dhaka'); // 'dhaka' or 'outside'

  // Toast notification
  const [toast, setToast] = useState(null);
  const toastTimerRef = React.useRef(null);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToast({ message, type, id });
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 2800);
  };

  useEffect(() => {
    try {
      localStorage.setItem('kids_fashion_bd_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('kids_fashion_bd_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  // Cart operations
  const addToCart = (product, size, color, quantity = 1) => {
    const chosenSize = size || product.sizes[0];
    const chosenColor = color || product.colors[0];
    const cartItemId = `${product.id}-${chosenSize}-${chosenColor.name}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          cartItemId,
          product,
          size: chosenSize,
          color: chosenColor,
          quantity,
        },
      ];
    });

    showToast(`Added "${product.name}" to cart`, 'success');
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  // Wishlist operations
  const toggleWishlist = (product) => {
    const exists = wishlist.some((item) => item.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      showToast(`Removed from wishlist`, 'info');
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`Saved to wishlist`, 'success');
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  // Promo Code Validation
  const applyPromoCode = (code) => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === 'THESALT10' || trimmed === 'KIDSBD10') {
      setAppliedPromo({ code: trimmed, discountPercent: 10, name: '10% Atelier Welcome Discount' });
      showToast(`Promo code ${trimmed} applied (10% OFF)!`, 'success');
      return { success: true, message: '10% Discount applied!' };
    } else if (trimmed === 'EID2026') {
      setAppliedPromo({ code: 'EID2026', discountPercent: 15, name: 'Eid Festive 15% OFF' });
      showToast('Promo code EID2026 applied (15% OFF)!', 'success');
      return { success: true, message: '15% Festive Discount applied!' };
    } else {
      showToast('Invalid coupon code. Try THESALT10', 'error');
      return { success: false, message: 'Invalid coupon code. Try THESALT10' };
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    showToast('Promo code removed', 'info');
  };

  // Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Free shipping threshold: ৳2,500
  const FREE_SHIPPING_THRESHOLD = 2500;
  const isFreeShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = cart.length === 0 ? 0 : isFreeShipping ? 0 : (deliveryRegion === 'dhaka' ? 60 : 120);

  const discountAmount = appliedPromo
    ? Math.round((cartSubtotal * appliedPromo.discountPercent) / 100)
    : 0;

  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  // Currency formatting
  const formatPrice = (amountInBDT) => {
    if (currency === 'USD') {
      const inUSD = (amountInBDT / USD_RATE).toFixed(2);
      return `$${inUSD}`;
    }
    return `৳${amountInBDT.toLocaleString('en-BD')}`;
  };

  // Filtered products calculation
  const filteredProducts = PRODUCTS.filter((product) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchTag = product.badge.toLowerCase().includes(q);
      const matchCategory = product.category.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchTag && !matchCategory) return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }

    // Gender filter
    if (selectedGender !== 'all' && product.gender !== selectedGender && product.gender !== 'unisex') {
      return false;
    }

    // Size filter
    if (selectedSize !== 'all' && !product.sizes.includes(selectedSize)) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (selectedSort === 'price-low') return a.price - b.price;
    if (selectedSort === 'price-high') return b.price - a.price;
    if (selectedSort === 'rating') return b.rating - a.rating;
    // Default featured
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <StoreContext.Provider
      value={{
        PRODUCTS,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartCount,
        shippingFee,
        isFreeShipping,
        FREE_SHIPPING_THRESHOLD,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        discountAmount,
        grandTotal,
        deliveryRegion,
        setDeliveryRegion,
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlist.length,
        currency,
        setCurrency,
        formatPrice,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        activeQuickView,
        setActiveQuickView,
        lastOrder,
        setLastOrder,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedGender,
        setSelectedGender,
        selectedSize,
        setSelectedSize,
        selectedSort,
        setSelectedSort,
        filteredProducts,
        theme,
        setTheme,
        toggleTheme,
        toast,
        showToast,
        setToast,
        closeToast: () => setToast(null),
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
