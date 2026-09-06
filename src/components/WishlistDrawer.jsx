import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export const WishlistDrawer = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    addToCart,
    formatPrice,
    setIsCartOpen,
  } = useStore();

  if (!isWishlistOpen) return null;

  const handleMoveToCart = (product) => {
    addToCart(product, product.sizes[0], product.colors[0], 1);
    toggleWishlist(product);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 w-full sm:w-auto">
        <div className="w-full sm:w-screen sm:max-w-md bg-white dark:bg-[#141417] text-neutral-900 dark:text-white shadow-2xl flex flex-col justify-between border-l border-neutral-200 dark:border-[#27272A] animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-neutral-200 dark:border-[#27272A] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4 text-[#C5A059]" />
              <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-900 dark:text-white">
                Saved Items
              </h2>
              <span className="text-[11px] bg-neutral-100 dark:bg-[#1E1E22] text-[#C5A059] border border-neutral-200 dark:border-[#27272A] font-semibold px-2 py-0.5 rounded-full font-mono">
                {wishlist.length}
              </span>
            </div>

            <button
              onClick={() => setIsWishlistOpen(false)}
              aria-label="Close wishlist"
              className="p-1.5 text-neutral-400 hover:text-black dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-[#27272A] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items Container */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-left divide-y divide-neutral-200 dark:divide-[#27272A]">
            {wishlist.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-[#1E1E22] border border-neutral-200 dark:border-[#27272A] text-neutral-400 flex items-center justify-center mx-auto">
                  <Heart className="w-6 h-6 text-[#C5A059]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 dark:text-white">No saved items yet</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto mt-1 leading-relaxed">
                    Click the heart icon on any piece you love to curate your personal wishlist.
                  </p>
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="bg-neutral-900 text-white dark:bg-[#F5EFEB] dark:text-black text-xs px-6 py-2.5 rounded-full uppercase tracking-wider font-bold hover:bg-black dark:hover:bg-white transition-all cursor-pointer shadow-sm"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              wishlist.map((product) => (
                <div key={product.id} className="pt-4 first:pt-0 flex gap-3.5 items-center">
                  <div className="w-18 h-22 rounded-xl overflow-hidden bg-neutral-100 dark:bg-[#1E1E22] border border-neutral-200 dark:border-[#27272A] flex-shrink-0">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-neutral-900 dark:text-white line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="text-xs font-bold text-neutral-900 dark:text-white mt-1 font-mono">
                      {formatPrice(product.price)}
                    </p>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => handleMoveToCart(product)}
                        className="bg-neutral-900 text-white dark:bg-[#F5EFEB] dark:text-black px-3.5 py-1.5 rounded-full text-xs font-semibold hover:bg-black dark:hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <ShoppingBag className="w-3 h-3 text-white dark:text-black" />
                        <span>Move to Bag</span>
                      </button>

                      <button
                        onClick={() => toggleWishlist(product)}
                        className="text-neutral-400 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {wishlist.length > 0 && (
            <div className="p-4 sm:p-5 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)] border-t border-neutral-200 dark:border-[#27272A] bg-neutral-50 dark:bg-[#09090B] text-center">
              <button
                onClick={() => {
                  wishlist.forEach((p) => addToCart(p, p.sizes[0], p.colors[0], 1));
                  setIsWishlistOpen(false);
                  setIsCartOpen(true);
                }}
                className="w-full bg-neutral-900 text-white hover:bg-black dark:bg-[#F5EFEB] dark:hover:bg-white dark:text-black py-4 sm:py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-md active:scale-98"
              >
                Add All Saved to Bag
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
