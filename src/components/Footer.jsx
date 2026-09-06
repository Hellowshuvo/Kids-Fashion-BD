import React from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Phone, Mail, ArrowUp } from 'lucide-react';

export const Footer = () => {
  const { setSelectedCategory, theme } = useStore();
  const isDark = theme === 'dark';

  const handleCategory = (cat) => {
    setSelectedCategory(cat);
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`border-t text-left pt-12 pb-8 transition-colors duration-200 ${
      isDark
        ? 'bg-[#09090B] border-neutral-800/80 text-neutral-400'
        : 'bg-neutral-50 border-neutral-200 text-neutral-600'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b ${
          isDark ? 'border-neutral-800/80' : 'border-neutral-200'
        }`}>
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-3">
            <div>
              <div className="flex items-center gap-2">
                {isDark ? (
                  <img
                    src="/kids-fashion-bd-logo-white.png"
                    alt="Kids Fashion BD"
                    className="h-10 w-auto object-contain block"
                  />
                ) : (
                  <img
                    src="/kids-fashion-bd-logo-black.png"
                    alt="Kids Fashion BD"
                    className="h-10 w-auto object-contain block"
                  />
                )}
              </div>
              <span className="text-[10px] text-neutral-500 block tracking-widest uppercase mt-2 font-mono">
                Luxury Children's Atelier · Narayanganj
              </span>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-sm font-normal">
              Luxury clothing studio for little humans at Katherpool Shibu Market, Narayanganj. Breathable organic fabrics, calming hues, and durable silhouettes.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <a
                href="#"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-black hover:bg-neutral-200 dark:hover:text-black dark:hover:bg-[#F5EFEB] dark:hover:border-[#F5EFEB] transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-black hover:bg-neutral-200 dark:hover:text-black dark:hover:bg-[#F5EFEB] dark:hover:border-[#F5EFEB] transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Collections */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Departments
            </h4>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li>
                <button onClick={() => handleCategory('Baby & Toddler')} className="hover:text-black dark:hover:text-white transition-colors cursor-pointer text-left w-full">
                  Baby & Toddler (0–2Y)
                </button>
              </li>
              <li>
                <button onClick={() => handleCategory('Girls')} className="hover:text-black dark:hover:text-white transition-colors cursor-pointer text-left w-full">
                  Girls Collection (2–8Y)
                </button>
              </li>
              <li>
                <button onClick={() => handleCategory('Boys')} className="hover:text-black dark:hover:text-white transition-colors cursor-pointer text-left w-full">
                  Boys Collection (2–8Y)
                </button>
              </li>
              <li>
                <button onClick={() => handleCategory('Festive')} className="hover:text-black dark:hover:text-white transition-colors cursor-pointer text-left w-full">
                  Eid & Festive Wear
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="lg:col-span-3 space-y-4 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Customer Care
            </h4>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li><span>Narayanganj & Dhaka Dispatch: 24-48h</span></li>
              <li><span>Nationwide Courier: 3-5 Days</span></li>
              <li><span>7-Day Hassle-Free Exchange</span></li>
            </ul>

            {/* Payment Methods */}
            <div className="pt-1">
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2 font-mono">Payment Channels</h5>
              <div className="flex flex-wrap gap-1.5">
                {['Visa', 'Mastercard', 'bKash', 'Nagad', 'COD'].map(method => (
                  <span key={method} className="text-[10px] font-bold uppercase bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Studio Location
            </h4>
            
            <div className="space-y-2.5 text-neutral-600 dark:text-neutral-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059] mt-0.5 flex-shrink-0" />
                <span>Katherpool Shibu Market, Narayanganj, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
                <span>+880 1712-894200</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
                <span>hello@kidsfashionbd.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026 Kids Fashion BD. All rights reserved.</p>
          
          <div className="flex flex-wrap justify-center items-center gap-6 text-[11px]">
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors cursor-pointer">Privacy Policy</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors cursor-pointer">Terms of Service</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors cursor-pointer">Shipping & Returns</a>
          </div>

          <div className="flex items-center gap-4">
            <p className="flex items-center gap-1 text-[11px]">Made with <span className="text-[#C5A059]">✦</span> in Narayanganj</p>
            <button 
              onClick={scrollToTop}
              className="w-7 h-7 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-900 hover:text-white dark:hover:bg-[#F5EFEB] dark:hover:text-black transition-all cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
};
