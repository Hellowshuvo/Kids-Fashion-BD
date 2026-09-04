import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Check, ArrowRight, Clock } from 'lucide-react';

export const Newsletter = () => {
  const { showToast, theme } = useStore();
  const isDark = theme === 'dark';
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setIsSubscribed(true);
    showToast('Thank you! Use KIDSBD10 for 10% OFF', 'success');
  };

  return (
    <section className={`py-10 sm:py-16 border-b transition-colors duration-200 ${
      isDark ? 'bg-[#09090B] border-neutral-800/80 text-white' : 'bg-white border-neutral-200 text-neutral-900'
    }`}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        
        <div className="bg-neutral-50 dark:bg-[#141417] p-6 sm:p-10 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs dark:shadow-xl relative overflow-hidden">
          
          {/* Decorative Illustration Element */}
          <div className="text-3xl sm:text-4xl mb-3">🎉✨🧸</div>

          {/* Countdown urgency */}
          <div className="inline-flex items-center gap-1.5 bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-[#C5A059] text-[9px] uppercase font-bold tracking-widest px-3 py-1 rounded-full mb-3 font-mono">
            <Clock className="w-3 h-3" />
            Exclusive Access: Season Drop 01
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-2">
            Receive 10% Off Your First Capsule
          </h3>

          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal mb-6 max-w-md mx-auto">
            Subscribe for early access to limited capsule releases, seasonal Eid drops, and member-exclusive updates.
          </p>

          {isSubscribed ? (
            <div className="p-3 bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-neutral-300 dark:border-neutral-700 shadow-xs max-w-sm mx-auto">
              <Check className="w-4 h-4 text-[#C5A059]" />
              <span>VIP Activated: Use code <strong className="text-[#C5A059]">KIDSBD10</strong> at checkout.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 px-4 py-2.5 rounded-full text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-[#C5A059] shadow-inner transition-colors"
              />
              <button
                type="submit"
                className="bg-neutral-900 text-white hover:bg-black dark:bg-[#F5EFEB] dark:hover:bg-white dark:text-[#09090B] px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02]"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Social Proof */}
          <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
            <div className="flex -space-x-1.5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-neutral-300 dark:bg-neutral-700 border border-white dark:border-neutral-800"></div>
              ))}
            </div>
            <span>Join 2,800+ parents who shop with us</span>
          </div>
          
          <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-2">
            No spam, ever. Unsubscribe with one click anytime.
          </p>
        </div>

      </div>
    </section>
  );
};
