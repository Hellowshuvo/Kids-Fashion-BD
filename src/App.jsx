import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryBar } from './components/CategoryBar';
import { ProductGrid } from './components/ProductGrid';
import { BrandManifesto } from './components/BrandManifesto';
import { Testimonials } from './components/Testimonials';
import { AtelierShowcase } from './components/AtelierShowcase';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { Toast } from './components/Toast';
import { ChatWidget } from './components/ChatWidget';
import { ShoppingBag, Heart, Home, Grid } from 'lucide-react';

const MainLayout = () => {
  const {
    cartCount,
    wishlistCount,
    setIsCartOpen,
    setIsWishlistOpen,
    setSelectedCategory,
    theme,
  } = useStore();

  const isDark = theme === 'dark';

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen flex flex-col selection:bg-[#C5A059] selection:text-black transition-colors duration-200 ${
      isDark ? 'bg-[#09090B] text-white' : 'bg-white text-neutral-900'
    }`}>
      {/* Main Navigation */}
      <Navbar />

      {/* Content */}
      <main className="flex-1">
        <Hero />
        <CategoryBar />
        <ProductGrid />
        <BrandManifesto />
        <Testimonials />
        <AtelierShowcase />
      </main>

      {/* Minimalist Footer */}
      <Footer />

      {/* Interactive Overlays & Modals */}
      <ProductModal />
      <CartDrawer />
      <WishlistDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <Toast />
      <ChatWidget />

      {/* Mobile Sticky Bottom Quick Bar */}
      <div className={`lg:hidden fixed bottom-0 inset-x-0 backdrop-blur-md border-t py-2.5 px-6 flex items-center justify-around z-30 shadow-2xl transition-colors duration-200 ${
        isDark
          ? 'bg-[#09090B]/95 text-white border-neutral-800/80'
          : 'bg-white/95 text-neutral-900 border-neutral-200'
      }`}>
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setSelectedCategory('all');
          }}
          className={`flex flex-col items-center gap-1 transition-colors ${
            isDark ? 'text-white hover:text-[#C5A059]' : 'text-neutral-900 hover:text-[#C5A059]'
          }`}
        >
          <Home className="w-4.5 h-4.5" />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        <button
          onClick={scrollToCatalog}
          className="flex flex-col items-center gap-1 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
        >
          <Grid className="w-4.5 h-4.5" />
          <span className="text-[10px] font-medium">Catalog</span>
        </button>

        <button
          onClick={() => setIsWishlistOpen(true)}
          className="relative flex flex-col items-center gap-1 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
        >
          <Heart className="w-4.5 h-4.5" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 right-2 bg-[#C5A059] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
          <span className="text-[10px] font-medium">Saved</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-1 text-neutral-900 dark:text-white hover:text-[#C5A059] transition-colors"
        >
          <ShoppingBag className="w-4.5 h-4.5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 right-2 bg-neutral-900 text-white dark:bg-[#F5EFEB] dark:text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] font-medium">Bag</span>
        </button>
      </div>

    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
