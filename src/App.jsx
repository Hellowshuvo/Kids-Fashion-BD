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
import { CheckoutPromptModal } from './components/CheckoutPromptModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { PaymentCallbackHandler } from './components/PaymentCallbackHandler';
import { Toast } from './components/Toast';
import { ChatWidget } from './components/ChatWidget';
import { ShoppingBag, Heart, Home, Grid } from 'lucide-react';

const MainLayout = () => {
  const {
    cartCount,
    wishlistCount,
    setIsCartOpen,
    setIsWishlistOpen,
    selectedCategory,
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
      {/* Top Delivery & Promo Announcement */}
      <AnnouncementBar />

      {/* Main Navigation */}
      <Navbar />

      {/* Content with bottom clearance for mobile sticky bar */}
      <main className="flex-1 pb-20 lg:pb-0">
        <Hero />
        <CategoryBar />
        <ProductGrid />
        <BrandManifesto />
        <Testimonials />
        <AtelierShowcase />
      </main>

      {/* Minimalist Footer with clearance */}
      <div className="pb-16 lg:pb-0">
        <Footer />
      </div>

      {/* Interactive Overlays & Modals */}
      <ProductModal />
      <CartDrawer />
      <WishlistDrawer />
      <CheckoutPromptModal />
      <CheckoutModal />
      <OrderSuccessModal />
      <PaymentCallbackHandler />
      <Toast />
      <ChatWidget />

      {/* Mobile Sticky Bottom Quick Bar */}
      <div className={`lg:hidden fixed bottom-0 inset-x-0 backdrop-blur-lg border-t pt-2 pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)] px-4 flex items-center justify-around z-30 shadow-2xl transition-colors duration-200 ${
        isDark
          ? 'bg-[#09090B]/95 text-white border-neutral-800/80'
          : 'bg-white/95 text-neutral-900 border-neutral-200'
      }`}>
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setSelectedCategory('all');
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
            selectedCategory === 'all'
              ? 'text-[#C5A059] font-bold'
              : isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-black'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        <button
          onClick={scrollToCatalog}
          className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-medium">Catalog</span>
        </button>

        <button
          onClick={() => setIsWishlistOpen(true)}
          className="relative flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
        >
          <Heart className="w-5 h-5" />
          {wishlistCount > 0 && (
            <span className="absolute top-0 right-2 bg-[#C5A059] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
          <span className="text-[10px] font-medium">Saved</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-neutral-900 dark:text-white hover:text-[#C5A059] transition-colors"
        >
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-2 bg-neutral-900 text-white dark:bg-[#F5EFEB] dark:text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] font-medium">Bag</span>
        </button>
      </div>

    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white text-neutral-900 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-4">
            <h2 className="text-2xl font-bold">Something went wrong</h2>
            <p className="text-sm text-neutral-600">
              An unexpected display issue occurred. Tap below to reload the storefront.
            </p>
            <button
              onClick={() => {
                try {
                  localStorage.removeItem('kfb_theme_mode_v3');
                } catch (e) {}
                window.location.reload();
              }}
              className="bg-neutral-900 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <MainLayout />
      </StoreProvider>
    </ErrorBoundary>
  );
}
