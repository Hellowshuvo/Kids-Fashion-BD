import React from 'react';
import { useStore } from '../context/StoreContext';

export const AnnouncementBar = () => {
  const { currency, setCurrency, applyPromoCode } = useStore();

  return (
    <div className="bg-[#09090B] text-neutral-400 text-[10px] tracking-widest uppercase py-2.5 px-4 sm:px-8 border-b border-[#27272A] font-mono">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Location & Contact */}
        <div className="hidden md:flex items-center gap-2 text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
          <span>Katherpool Shibu Market, Narayanganj</span>
        </div>

        {/* Center: Promo / Delivery info */}
        <div className="flex-1 text-center font-medium text-neutral-300">
          <span>Free delivery in Narayanganj & Dhaka over ৳2,500</span>
          <span className="mx-2 text-neutral-600">•</span>
          <span>Use code </span>
          <button
            onClick={() => applyPromoCode('THESALT10')}
            className="text-[#C5A059] font-bold underline underline-offset-4 hover:text-white cursor-pointer transition-colors"
          >
            THESALT10
          </button>
          <span> for 10% OFF</span>
        </div>

        {/* Right: Currency Selector */}
        <div className="flex items-center gap-1.5 text-[10px]">
          <button
            onClick={() => setCurrency('BDT')}
            className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
              currency === 'BDT' ? 'text-white font-bold bg-[#1E1E22] border border-[#27272A]' : 'text-neutral-500 hover:text-white'
            }`}
          >
            ৳ BDT
          </button>
          <span className="text-neutral-700">|</span>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
              currency === 'USD' ? 'text-white font-bold bg-[#1E1E22] border border-[#27272A]' : 'text-neutral-500 hover:text-white'
            }`}
          >
            $ USD
          </button>
        </div>

      </div>
    </div>
  );
};
