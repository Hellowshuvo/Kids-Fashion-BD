import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ShieldCheck, Truck } from 'lucide-react';

export const Hero = () => {
  const { setSelectedCategory, theme } = useStore();
  const isDark = theme === 'dark';

  const handleExplore = (category = 'all') => {
    setSelectedCategory(category);
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={`relative py-10 sm:py-16 lg:py-20 border-b overflow-hidden transition-colors duration-200 ${
      isDark ? 'bg-[#09090B] text-white border-neutral-800/80' : 'bg-white text-neutral-900 border-neutral-200'
    }`}>
      
      {/* Subtle warm glow in background */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
          
          {/* Left Column: Clacton On Tea Editorial Style */}
          <div className="text-left space-y-6 sm:space-y-8">
            
            {/* Gold Rule & Location Metadata */}
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#C5A059]"></span>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] uppercase text-[#C5A059] font-mono">
                — KATHERPOOL SHIBU MARKET, NARAYANGANJ
              </span>
            </div>

            {/* Kids Fashion BD brand logo in the custom chunky cutout font */}
            <div className="py-0 sm:py-1">
              <h1 className="sr-only">Kids Fashion BD</h1>
              {isDark ? (
                /* Dark mode: crisp white cutout letters */
                <img
                  src="/kids-fashion-bd-logo-white.png"
                  alt="Kids Fashion BD"
                  className="h-20 sm:h-32 md:h-44 lg:h-52 w-auto object-contain select-none filter drop-shadow-2xl hover:scale-[1.01] transition-transform duration-300 block"
                />
              ) : (
                /* Light mode: crisp black cutout letters */
                <img
                  src="/kids-fashion-bd-logo-black.png"
                  alt="Kids Fashion BD"
                  className="h-20 sm:h-32 md:h-44 lg:h-52 w-auto object-contain select-none filter drop-shadow-md hover:scale-[1.01] transition-transform duration-300 block"
                />
              )}
            </div>

            {/* Description Text */}
            <p className={`text-xs sm:text-base leading-relaxed font-normal max-w-md ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              Your neighborhood luxury atelier for pure organic essentials. 100% GOTS certified combed cotton, breathable washed linens, and timeless moments worth sharing.
            </p>

            {/* Pill Buttons (Primary + Outline Secondary) */}
            <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-2.5 sm:gap-4">
              <button
                onClick={() => handleExplore('all')}
                className={`flex-1 sm:flex-none px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer shadow-lg hover:scale-[1.02] text-center ${
                  isDark
                    ? 'bg-[#F5EFEB] hover:bg-white text-[#09090B]'
                    : 'bg-neutral-900 hover:bg-black text-white'
                }`}
              >
                EXPLORE NOW
              </button>

              <button
                onClick={() => handleExplore('Festive')}
                className={`flex-1 sm:flex-none px-5 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer text-center ${
                  isDark
                    ? 'border border-neutral-700 hover:border-white text-white hover:bg-white/5'
                    : 'border border-neutral-300 hover:border-black text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                EID CAPSULE
              </button>
            </div>

            {/* Mobile Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>24-48h Delivery</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Cash on Delivery</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>100% GOTS Cotton</span>
              </span>
            </div>



          </div>

          {/* Right Column: Atelier Presentation Image */}
          <div className="flex justify-center md:justify-end">
            <div className={`relative w-full max-w-[420px] lg:max-w-[460px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border transition-all duration-300 group ${
              isDark ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-neutral-100'
            }`}>
              
              <img
                src="/kids-fashion-bd-hero.jpg"
                alt="Kids Fashion BD Atelier Packaging"
                className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
              />
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
