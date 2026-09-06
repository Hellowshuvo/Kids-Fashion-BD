import React from 'react';
import { useStore } from '../context/StoreContext';

export const AnnouncementBar = () => {
  const { currency, setCurrency, applyPromoCode, theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <div className={`text-[10px] tracking-widest uppercase py-2 sm:py-2.5 px-3 sm:px-8 border-b font-mono transition-colors duration-200 ${
      isDark
        ? 'bg-[#09090B] text-neutral-400 border-[#27272A]'
        : 'bg-[#F5EFEB] text-neutral-700 border-neutral-200'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Left: Location & Contact */}
        <div className="hidden md:flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
          <span>Katherpool Shibu Market, Narayanganj</span>
        </div>

        {/* Center: Promo / Delivery info */}
        <div className={`flex-1 text-center font-medium text-[10px] sm:text-xs tracking-wider flex items-center justify-center gap-1 sm:gap-2 truncate ${
          isDark ? 'text-neutral-300' : 'text-neutral-800'
        }`}>
          <span className="truncate">✨ Special Deal: All Items ৳200 · COD Nationwide</span>
          <span className="text-neutral-400 dark:text-neutral-600">•</span>
          <span className="hidden xs:inline">Use code </span>
          <button
            onClick={() => applyPromoCode('KIDSBD10')}
            className="text-[#C5A059] font-bold underline underline-offset-2 hover:opacity-80 cursor-pointer transition-opacity"
          >
            KIDSBD10
          </button>
          <span className="hidden xs:inline"> for 10% OFF</span>
        </div>

        {/* Right: Currency Selector */}
        <div className="flex items-center gap-1.5 text-[10px]">
          <button
            onClick={() => setCurrency('BDT')}
            className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
              currency === 'BDT'
                ? isDark
                  ? 'text-white font-bold bg-[#1E1E22] border border-[#27272A]'
                  : 'text-neutral-900 font-bold bg-white border border-neutral-300 shadow-xs'
                : isDark ? 'text-neutral-500 hover:text-white' : 'text-neutral-500 hover:text-black'
            }`}
          >
            ৳ BDT
          </button>
          <span className="text-neutral-300 dark:text-neutral-700">|</span>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
              currency === 'USD'
                ? isDark
                  ? 'text-white font-bold bg-[#1E1E22] border border-[#27272A]'
                  : 'text-neutral-900 font-bold bg-white border border-neutral-300 shadow-xs'
                : isDark ? 'text-neutral-500 hover:text-white' : 'text-neutral-500 hover:text-black'
            }`}
          >
            $ USD
          </button>
        </div>

      </div>
    </div>
  );
};
