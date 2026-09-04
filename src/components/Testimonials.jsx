import React from 'react';
import { useStore } from '../context/StoreContext';
import { REVIEWS } from '../data/products';
import { Star } from 'lucide-react';

export const Testimonials = () => {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <section className={`py-10 sm:py-16 border-b transition-colors duration-200 ${
      isDark ? 'bg-[#09090B] border-neutral-800/80 text-white' : 'bg-white border-neutral-200 text-neutral-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Header & Rating Summary */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-[1.5px] bg-[#C5A059] rounded-full"></span>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] uppercase text-[#C5A059] font-mono">
                Community Stories
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-2">
              Loved by Parents in Narayanganj & Dhaka
            </h2>
            <div className="inline-flex items-center gap-2.5 bg-neutral-100 dark:bg-[#141417] px-3.5 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 shadow-xs">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" />
                ))}
              </div>
              <span className="text-xs font-semibold text-neutral-900 dark:text-white">5.0 ★</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">· 130+ verified reviews</span>
            </div>
          </div>
        </div>

        {/* 3 Soft Rounded Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {REVIEWS.map((rev) => {
            const authorName = rev.author || rev.name;
            const initial = authorName ? authorName.charAt(0).toUpperCase() : 'U';
            return (
              <div
                key={rev.id}
                className="p-5 sm:p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#141417] flex flex-col justify-between shadow-xs dark:shadow-black/40 hover:border-neutral-400 dark:hover:border-neutral-700 transition-all duration-200 relative"
              >
                {/* Decorative Quotation */}
                <div className="absolute top-4 right-4 text-5xl text-neutral-300 dark:text-neutral-800/60 font-serif leading-none select-none">
                  "
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-normal mb-4">
                    "{rev.comment}"
                  </p>
                  
                  {/* Subtle product tag */}
                  <div className="inline-block bg-white dark:bg-black/60 border border-neutral-200 dark:border-neutral-800 rounded-full px-2.5 py-0.5 mb-3 text-[10px] uppercase tracking-wider font-semibold text-neutral-600 dark:text-neutral-400 font-mono">
                    {rev.product || rev.productName || 'Organic Cotton Set'}
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-neutral-900 text-white dark:bg-[#F5EFEB] dark:text-[#09090B] flex items-center justify-center font-bold text-xs shrink-0">
                      {initial}
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 dark:text-white text-xs">
                        {authorName}
                      </h4>
                      <p className="text-[10px] text-neutral-500">{rev.location || rev.city}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-700 bg-neutral-200 dark:text-neutral-300 dark:bg-neutral-800 px-2 py-1 rounded-full shrink-0 font-mono">
                    Verified
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
