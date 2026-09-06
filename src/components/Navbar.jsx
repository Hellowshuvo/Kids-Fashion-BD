import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, ShoppingBag, Heart, Menu, X, Sun, Moon } from 'lucide-react';

export const Navbar = () => {
  const {
    cartCount,
    wishlistCount,
    setIsCartOpen,
    setIsWishlistOpen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    theme,
    setTheme,
    toggleTheme,
  } = useStore();

  const isDark = theme === 'dark';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'all', label: 'All Items' },
    { id: 'Baby & Toddler', label: 'Baby (0–2Y)' },
    { id: 'Girls', label: 'Girls (2–8Y)' },
    { id: 'Boys', label: 'Boys (2–8Y)' },
    { id: 'Festive', label: 'Eid & Festive' },
  ];

  const handleNavClick = (id) => {
    setSelectedCategory(id);
    setMobileMenuOpen(false);
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-all duration-200 ${
      isDark
        ? `bg-[#09090B]/95 border-neutral-800/80 text-white ${isScrolled ? 'shadow-md shadow-black/40' : ''}`
        : `bg-white/95 border-neutral-200 text-neutral-900 ${isScrolled ? 'shadow-md' : ''}`
    }`}>
      <div className={`max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-200 ${isScrolled ? 'h-13 sm:h-14' : 'h-14 sm:h-16'}`}>
          
          {/* Left: Hamburger (Mobile) + Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className="lg:hidden text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Brand Logo & Wordmark */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setSelectedCategory('all');
                setSearchQuery('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 group cursor-pointer select-none"
              title="Kids Fashion BD - Return to Home"
            >
              {isDark ? (
                <img
                  src="/kids-fashion-bd-logo-white.png"
                  alt="Kids Fashion BD"
                  className="h-8 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                />
              ) : (
                <img
                  src="/kids-fashion-bd-logo-black.png"
                  alt="Kids Fashion BD"
                  className="h-8 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                />
              )}
            </a>

            {/* Desktop-only Social Channels */}
            <div className={`hidden xl:flex items-center gap-4 text-[11px] font-medium tracking-widest border-l pl-4 ml-2 ${
              isDark ? 'border-neutral-800 text-neutral-400' : 'border-neutral-200 text-neutral-600'
            }`}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white transition-colors uppercase">
                Instagram
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white transition-colors uppercase">
                Facebook
              </a>
            </div>
          </div>

          {/* Right Actions: Theme Switcher, Search, Wishlist, Cart */}
          <div className="flex items-center gap-1 sm:gap-2.5 text-xs">
            
            {/* Desktop Theme Switcher (White / Black) */}
            <div
              className={`hidden sm:flex items-center p-0.5 sm:p-1 rounded-full border shadow-inner transition-colors duration-200 ${
                isDark ? 'bg-neutral-900 border-neutral-700' : 'bg-neutral-100 border-neutral-300'
              }`}
              role="group"
              aria-label="Background Color Selector"
            >
              <button
                type="button"
                onClick={() => setTheme('light')}
                title="Switch to White background"
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                  !isDark
                    ? 'bg-white text-neutral-950 shadow-md ring-1 ring-black/15'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Sun className={`w-3.5 h-3.5 ${!isDark ? 'text-amber-500 fill-amber-500' : 'text-neutral-400'}`} />
                <span>White</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                title="Switch to Black background"
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                  isDark
                    ? 'bg-[#27272A] text-white shadow-md ring-1 ring-white/20'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-[#C5A059] fill-[#C5A059]' : 'text-neutral-400'}`} />
                <span>Black</span>
              </button>
            </div>

            {/* Mobile Compact 1-Tap Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="sm:hidden p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors cursor-pointer"
              aria-label="Toggle dark/light theme"
              title={isDark ? "Switch to White Mode" : "Switch to Black Mode"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-neutral-700" />
              )}
            </button>

            {/* Search Trigger */}
            {showSearch ? (
              <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-full px-2.5 sm:px-3 py-1 w-36 sm:w-52 bg-neutral-100 dark:bg-neutral-900/90 shadow-inner transition-all duration-200">
                <Search className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 mr-1.5 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search garments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="bg-transparent text-neutral-900 dark:text-white placeholder:text-neutral-500 text-xs outline-none w-full"
                />
                <button
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery('');
                  }}
                  className="text-neutral-500 hover:text-black dark:hover:text-white text-xs ml-1 p-0.5"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                aria-label="Search"
                className="p-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60 rounded-full transition-colors cursor-pointer"
                title="Search collection"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Wishlist Link (Desktop) */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              aria-label="Wishlist"
              className="p-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60 rounded-full transition-colors hidden sm:flex items-center gap-1 cursor-pointer"
              title="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="text-[10px] font-bold bg-[#C5A059] text-black px-1.5 py-0.2 rounded-full font-mono">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Bag"
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white hover:border-neutral-500 transition-all duration-200 cursor-pointer font-semibold shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="text-xs uppercase tracking-wider hidden sm:inline-block">Bag</span>
              <span className="text-[10px] font-bold bg-neutral-900 text-white dark:bg-[#F5EFEB] dark:text-black px-1.5 py-0.2 rounded-full font-mono">
                {cartCount}
              </span>
            </button>

          </div>

        </div>

        {/* Mobile Search Bar Expansion when activated */}
        {showSearch && (
          <div className="sm:hidden px-4 pb-3 pt-1 border-t border-neutral-200/60 dark:border-neutral-800/60 bg-white/95 dark:bg-[#09090B]/95">
            <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-full px-3 py-2 bg-neutral-100 dark:bg-neutral-900/90 shadow-inner">
              <Search className="w-4 h-4 text-neutral-500 dark:text-neutral-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by name, fabric, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-neutral-900 dark:text-white placeholder:text-neutral-500 text-sm outline-none w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-neutral-400 hover:text-black dark:hover:text-white text-xs px-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#09090B] px-5 py-4 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
            {/* Background Theme Selector in Drawer */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-mono">
                Theme:
              </span>
              <div className="flex items-center bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded-full border border-neutral-300 dark:border-neutral-700">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase transition-all ${
                    theme === 'light'
                      ? 'bg-white text-black shadow-xs font-semibold'
                      : 'text-neutral-500'
                  }`}
                >
                  <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-500' : ''}`} />
                  <span>White</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase transition-all ${
                    theme === 'dark'
                      ? 'bg-[#18181B] text-white shadow-xs font-semibold'
                      : 'text-neutral-500'
                  }`}
                >
                  <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-[#C5A059]' : ''}`} />
                  <span>Black</span>
                </button>
              </div>
            </div>

            {/* Quick Collections */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2 font-mono">
                Explore Collections
              </div>
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`flex items-center justify-between w-full text-left text-xs font-semibold py-2.5 px-3 rounded-xl transition-all duration-150 cursor-pointer ${
                      selectedCategory === link.id
                        ? 'bg-neutral-900 text-white dark:bg-[#F5EFEB] dark:text-black shadow-xs'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    <span className="text-[10px] opacity-70 font-mono">→</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Studio Call / WhatsApp Order */}
            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
              <a
                href="tel:+8801712894200"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <span>📞 Call Studio: 01712-894200</span>
              </a>
              <p className="text-[10px] text-center text-neutral-500">
                Katherpool Shibu Market, Narayanganj · 24-48h Dispatch
              </p>
            </div>
          </div>
        )}
      </header>
  );
};
