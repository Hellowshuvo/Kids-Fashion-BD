import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, ArrowRight, X } from 'lucide-react';

export const CheckoutPromptModal = () => {
  const {
    checkoutPrompt,
    isCheckoutPromptOpen,
    closeCheckoutPrompt,
    proceedToCheckoutFromPrompt,
    cartCount,
    cartSubtotal,
    formatPrice,
    setIsCartOpen,
    theme,
  } = useStore();

  if (!isCheckoutPromptOpen || !checkoutPrompt) return null;

  const { product, size, color, quantity } = checkoutPrompt;
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeCheckoutPrompt}
      />

      {/* Modal / Bottom Sheet */}
      <div className={`relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border shadow-2xl p-5 sm:p-6 text-left z-10 transition-all duration-200 pb-[calc(env(safe-area-inset-bottom,0px)+1.25rem)] ${
        isDark
          ? 'bg-[#141417] border-neutral-800 text-white'
          : 'bg-white border-neutral-200 text-neutral-900'
      }`}>
        
        {/* Close Button */}
        <button
          onClick={closeCheckoutPrompt}
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Tag & Confirmation */}
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
            Added to Bag
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-1">
          Ready to Checkout?
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
          Would you like to place your order now or continue browsing the collection?
        </p>

        {/* Product Card Preview */}
        <div className={`p-3 rounded-2xl border flex items-center gap-3 mb-4 ${
          isDark ? 'bg-[#09090B] border-neutral-800' : 'bg-neutral-50 border-neutral-200'
        }`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-16 h-20 sm:w-18 sm:h-22 object-cover object-center rounded-xl flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white line-clamp-1">
              {product.name}
            </h4>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              Size: <strong className="text-neutral-800 dark:text-neutral-200">{size}</strong> · Qty: {quantity}
            </p>
            {color && color.name && (
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Color: <strong className="text-neutral-800 dark:text-neutral-200">{color.name}</strong>
              </p>
            )}
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-sm font-extrabold text-[#C5A059] font-mono">
                {formatPrice(product.price * quantity)}
              </span>
              {product.originalPrice && (
                <span className="text-[10px] text-neutral-400 line-through">
                  {formatPrice(product.originalPrice * quantity)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bag Subtotal Preview */}
        <div className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-neutral-100/70 dark:bg-[#1E1E22] mb-4 text-xs">
          <span className="text-neutral-600 dark:text-neutral-400 font-medium">
            Bag Total ({cartCount} {cartCount === 1 ? 'item' : 'items'}):
          </span>
          <span className="font-extrabold text-neutral-900 dark:text-white font-mono text-sm">
            {formatPrice(cartSubtotal)}
          </span>
        </div>

        {/* Primary Checkout CTA */}
        <div className="space-y-2">
          <button
            onClick={proceedToCheckoutFromPrompt}
            className="w-full bg-[#C5A059] hover:bg-[#b59149] text-black font-extrabold py-3.5 sm:py-3.5 rounded-full text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all transform active:scale-98 cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Secondary Action: Continue Shopping */}
          <button
            onClick={closeCheckoutPrompt}
            className="w-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold py-3 rounded-full text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>

        {/* Bottom Link: View Shopping Bag */}
        <div className="mt-3 text-center">
          <button
            onClick={() => {
              closeCheckoutPrompt();
              setIsCartOpen(true);
            }}
            className="text-[11px] text-neutral-500 hover:text-black dark:hover:text-white underline underline-offset-4 cursor-pointer transition-colors"
          >
            View Shopping Bag details
          </button>
        </div>

      </div>
    </div>
  );
};
