import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Truck,
  Tag,
} from 'lucide-react';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartCount,
    shippingFee,
    isFreeShipping,
    FREE_SHIPPING_THRESHOLD,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    discountAmount,
    grandTotal,
    deliveryRegion,
    setDeliveryRegion,
    formatPrice,
    setIsCheckoutOpen,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    applyPromoCode(promoInput);
    setPromoInput('');
  };

  const freeShippingProgress = Math.min(
    100,
    Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#141417] text-neutral-900 dark:text-white shadow-2xl flex flex-col justify-between border-l border-neutral-200 dark:border-[#27272A] animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-neutral-200 dark:border-[#27272A] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
              <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-900 dark:text-white">
                Shopping Bag
              </h2>
              <span className="text-[11px] bg-neutral-100 dark:bg-[#1E1E22] text-[#C5A059] border border-neutral-200 dark:border-[#27272A] font-semibold px-2 py-0.5 rounded-full font-mono">
                {cartCount}
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              aria-label="Close cart"
              className="p-1.5 text-neutral-400 hover:text-black dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-[#27272A] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-neutral-50 dark:bg-[#09090B] px-5 py-3.5 border-b border-neutral-200 dark:border-[#27272A] text-left">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                <Truck className="w-3.5 h-3.5 text-[#C5A059]" />
                {isFreeShipping ? (
                  <strong className="text-emerald-600 dark:text-emerald-400 font-medium">Free delivery unlocked</strong>
                ) : (
                  <span>
                    Add <strong className="text-neutral-900 dark:text-white font-semibold">{formatPrice(remainingForFreeShipping)}</strong> for free delivery
                  </span>
                )}
              </span>
              <span className="text-[11px] font-mono text-[#C5A059]">
                {freeShippingProgress}%
              </span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-[#27272A] h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#C5A059] to-[#DFBF7A] transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items Container */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-left divide-y divide-neutral-200 dark:divide-[#27272A]">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-[#1E1E22] border border-neutral-200 dark:border-[#27272A] text-neutral-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6 text-[#C5A059]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 dark:text-white">Your bag is empty</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto mt-1 leading-relaxed">
                    Explore our curated Eid Capsule and gentle organic cotton pieces.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-neutral-900 text-white dark:bg-[#F5EFEB] dark:text-black text-xs px-6 py-2.5 rounded-full uppercase tracking-wider font-bold hover:bg-black dark:hover:bg-white transition-all cursor-pointer shadow-sm"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartItemId} className="pt-4 first:pt-0 flex gap-3.5">
                  {/* Thumbnail */}
                  <div className="w-20 h-24 rounded-xl overflow-hidden bg-neutral-100 dark:bg-[#1E1E22] border border-neutral-200 dark:border-[#27272A] flex-shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-neutral-900 dark:text-white line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          aria-label="Remove item"
                          className="text-neutral-400 hover:text-rose-500 transition-colors p-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Chosen color & size */}
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2 h-2 rounded-full border border-neutral-300 dark:border-neutral-600 inline-block"
                            style={{ backgroundColor: item.color.hex }}
                          />
                          <span>{item.color.name}</span>
                        </span>
                        <span>•</span>
                        <span className="bg-neutral-100 dark:bg-[#1E1E22] border border-neutral-200 dark:border-[#27272A] px-1.5 py-0.5 rounded text-neutral-700 dark:text-neutral-300 font-mono text-[10px]">
                          {item.size}
                        </span>
                      </div>
                    </div>

                    {/* Quantity & Item Subtotal */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="inline-flex items-center border border-neutral-200 dark:border-[#27272A] rounded-lg bg-neutral-100 dark:bg-[#1E1E22] p-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-white dark:bg-[#27272A] flex items-center justify-center text-xs font-bold text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer shadow-xs"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-neutral-900 dark:text-white font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-white dark:bg-[#27272A] flex items-center justify-center text-xs font-bold text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer shadow-xs"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-neutral-900 dark:text-white font-mono">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Calculations & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-neutral-200 dark:border-[#27272A] bg-neutral-50 dark:bg-[#09090B] space-y-3.5 text-left">
              
              {/* Promo code form */}
              {appliedPromo ? (
                <div className="flex items-center justify-between bg-white dark:bg-[#1E1E22] border border-[#C5A059]/40 p-2.5 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {appliedPromo.code} <span className="text-[#C5A059]">({appliedPromo.discountPercent}% OFF)</span>
                    </span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-xs text-rose-500 hover:underline font-medium cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code (Try KIDSBD10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 bg-white dark:bg-[#1E1E22] border border-neutral-300 dark:border-[#27272A] rounded-xl px-3 py-2 text-xs uppercase text-neutral-900 dark:text-white placeholder:normal-case placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-[#C5A059]"
                  />
                  <button
                    type="submit"
                    className="bg-neutral-200 hover:bg-neutral-300 dark:bg-[#27272A] dark:hover:bg-[#323238] text-neutral-900 dark:text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Delivery Zone Selection */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-neutral-500 dark:text-neutral-400">Delivery:</span>
                <div className="inline-flex bg-neutral-200 dark:bg-[#1E1E22] p-0.5 rounded-lg border border-neutral-300 dark:border-[#27272A]">
                  <button
                    onClick={() => setDeliveryRegion('dhaka')}
                    className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                      deliveryRegion === 'dhaka'
                        ? 'bg-white text-neutral-900 dark:bg-[#F5EFEB] dark:text-black font-semibold shadow-xs'
                        : 'text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white'
                    }`}
                  >
                    Narayanganj / Dhaka (৳60)
                  </button>
                  <button
                    onClick={() => setDeliveryRegion('outside')}
                    className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                      deliveryRegion === 'outside'
                        ? 'bg-white text-neutral-900 dark:bg-[#F5EFEB] dark:text-black font-semibold shadow-xs'
                        : 'text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white'
                    }`}
                  >
                    Outside (৳120)
                  </button>
                </div>
              </div>

              {/* Price summary lines */}
              <div className="space-y-1.5 text-xs pt-1 border-t border-neutral-200 dark:border-[#27272A]">
                <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Subtotal</span>
                  <span className="text-neutral-900 dark:text-white font-mono">{formatPrice(cartSubtotal)}</span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-[#C5A059] font-medium">
                    <span>Discount ({appliedPromo.discountPercent}%)</span>
                    <span className="font-mono">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Estimated Shipping</span>
                  <span className="font-mono">{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span>
                </div>

                <div className="flex justify-between text-sm font-bold text-neutral-900 dark:text-white pt-2 border-t border-neutral-200 dark:border-[#27272A]">
                  <span className="uppercase tracking-wider text-xs">Grand Total</span>
                  <span className="font-mono text-base text-neutral-900 dark:text-[#F5EFEB]">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full bg-neutral-900 hover:bg-black text-white dark:bg-[#F5EFEB] dark:hover:bg-white dark:text-black py-3.5 px-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 group active:scale-[0.99] cursor-pointer shadow-lg"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-white dark:text-black group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-[10px] text-center text-neutral-400 dark:text-neutral-500">
                Cash on Delivery, bKash, Nagad & Cards accepted across Bangladesh
              </p>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
