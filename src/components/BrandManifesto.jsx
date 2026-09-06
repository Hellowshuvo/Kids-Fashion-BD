import React from 'react';
import { useStore } from '../context/StoreContext';
import { Truck, Scissors, Layers } from 'lucide-react';

export const BrandManifesto = () => {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <section className={`relative overflow-hidden py-12 sm:py-16 border-b text-left transition-colors duration-200 ${
      isDark ? 'bg-[#09090B] text-white border-neutral-800/80' : 'bg-neutral-50 text-neutral-900 border-neutral-200'
    }`}>
      {/* Subtle warm glow in background */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        


        {/* Brand Headline - Compact */}
        <div className="max-w-3xl space-y-3 mb-8">
          <div className="flex items-center gap-2">
            <span className="w-6 h-[1.5px] bg-[#C5A059] rounded-full"></span>
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] uppercase text-[#C5A059] font-mono">
              Craftsmanship & Heritage
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
            Not just clothes. A gentle culture of daily play.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed max-w-2xl">
            Defining the sweet spot between Parisian tailored elegance, Tokyo streetwear ease, and Bangladesh's rich cotton heritage for little humans.
          </p>
        </div>

        {/* 3 Soft Rounded Cards - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          
          <div className="p-5 sm:p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 backdrop-blur-sm space-y-2.5 transition-all duration-200 hover:shadow-md dark:hover:bg-neutral-900/60 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-white mb-1">
              <Layers className="w-4.5 h-4.5 text-neutral-700 dark:text-neutral-300" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
              100% GOTS Organic Cotton <span className="text-sm">🌿</span>
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
              Heavyweight 240GSM combed cotton jersey and pure washed linen. Completely free from harmful formaldehydes, azo dyes, and scratchy tags.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 backdrop-blur-sm space-y-2.5 transition-all duration-200 hover:shadow-md dark:hover:bg-neutral-900/60 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-white mb-1">
              <Scissors className="w-4.5 h-4.5 text-neutral-700 dark:text-neutral-300" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
              Playground-Tested Seams <span className="text-sm">🧵</span>
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
              Flatlock anti-chafing seams, nickel-free snap hardware, and ergonomic cuts designed for uninhibited tree-climbing and city exploration.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 backdrop-blur-sm space-y-2.5 transition-all duration-200 hover:shadow-md dark:hover:bg-neutral-900/60 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-white mb-1">
              <Truck className="w-4.5 h-4.5 text-neutral-700 dark:text-neutral-300" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
              Fast 24-48h Dispatch <span className="text-sm">⚡</span>
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
              Direct dispatch across Narayanganj & Dhaka in 24-48 hours. Nationwide courier service with full Cash on Delivery (COD) and bKash integration.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
