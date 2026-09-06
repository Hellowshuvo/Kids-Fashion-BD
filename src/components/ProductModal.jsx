import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Heart, ShoppingBag } from 'lucide-react';

export const ProductModal = () => {
  const {
    activeQuickView,
    setActiveQuickView,
    addToCart,
    formatPrice,
    toggleWishlist,
    isInWishlist,
  } = useStore();

  const product = activeQuickView;

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  React.useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0]);
      setSelectedColor(product.colors[0]);
      setSelectedImage(product.images[0]);
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setActiveQuickView(null);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity, false);
    setActiveQuickView(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={() => setActiveQuickView(null)} />

      <div className="relative bg-white dark:bg-[#141417] text-neutral-900 dark:text-white rounded-t-3xl sm:rounded-3xl max-w-3xl w-full border-t sm:border border-neutral-200 dark:border-[#27272A] z-10 text-left shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        
        {/* Mobile Pull Handle Indicator */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center">
          <div className="w-10 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full" />
        </div>

        {/* Close Button */}
        <button
          onClick={() => setActiveQuickView(null)}
          aria-label="Close"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white bg-neutral-100/90 dark:bg-[#1E1E22]/90 rounded-full hover:bg-neutral-200 dark:hover:bg-[#27272A] transition-colors cursor-pointer border border-neutral-200 dark:border-[#27272A]"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 overscroll-contain">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Left: Product Image */}
            <div className="bg-neutral-50 dark:bg-[#09090B] p-4 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-200 dark:border-[#27272A]">
              <div className="w-full aspect-[3/4] max-w-[280px] sm:max-w-none mx-auto bg-white dark:bg-[#141417] rounded-2xl border border-neutral-200 dark:border-[#27272A] overflow-hidden relative shadow-xs">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {product.images.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-12 sm:w-14 aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImage === img ? 'border-[#C5A059] ring-2 ring-[#C5A059]/30' : 'border-neutral-200 dark:border-[#27272A] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details */}
            <div className="p-4 sm:p-8 flex flex-col justify-between space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#C5A059] font-bold block mb-1 font-mono">
                    {product.category} · {product.ageBracket}
                  </span>
                  <h2 className="text-lg sm:text-2xl font-bold text-neutral-900 dark:text-white font-serif">
                    {product.name}
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">{product.tagline}</p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2.5 py-0.5">
                  <span className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-[#F5EFEB] font-mono">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-500 line-through font-mono">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Color Selection */}
                <div>
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                    Color: <span className="font-normal text-neutral-500 dark:text-neutral-400">{selectedColor?.name}</span>
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    {product.colors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
                          selectedColor?.name === color.name
                            ? 'border-[#C5A059] bg-neutral-100 dark:bg-[#1E1E22] text-neutral-900 dark:text-white shadow-xs font-medium ring-1 ring-[#C5A059]/40'
                            : 'border-neutral-200 dark:border-[#27272A] text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-500 bg-white dark:bg-[#141417]'
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-neutral-300 dark:border-neutral-600"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div>
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                    Select Size: <span className="font-normal text-neutral-500 dark:text-neutral-400">{selectedSize}</span>
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          selectedSize === sz
                            ? 'border-neutral-900 bg-neutral-900 text-white dark:border-[#F5EFEB] dark:bg-[#F5EFEB] dark:text-black shadow-xs'
                            : 'border-neutral-200 bg-neutral-50 text-neutral-800 dark:border-[#27272A] dark:text-neutral-300 dark:bg-[#1E1E22] hover:border-neutral-400'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1.5">Quantity:</span>
                  <div className="inline-flex items-center border border-neutral-200 dark:border-[#27272A] rounded-xl overflow-hidden bg-neutral-50 dark:bg-[#1E1E22]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-[#27272A] cursor-pointer transition-colors"
                    >
                      -
                    </button>
                    <span className="w-9 text-center text-xs font-bold text-neutral-900 dark:text-white font-mono">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-[#27272A] cursor-pointer transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Desktop Action Buttons */}
                <div className="hidden sm:flex items-center gap-2.5 pt-2">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-neutral-900 hover:bg-black text-white dark:bg-[#F5EFEB] dark:hover:bg-white dark:text-black py-3.5 rounded-full text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="flex-1 border border-neutral-300 dark:border-[#27272A] hover:border-neutral-500 py-3.5 rounded-full text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 cursor-pointer text-neutral-900 dark:text-white"
                  >
                    <span>Instant Checkout</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-3.5 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                      isWishlisted
                        ? 'border-rose-500 bg-rose-50 text-rose-500 dark:border-rose-500/50 dark:bg-rose-500/20 dark:text-rose-400'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-[#27272A] dark:bg-[#1E1E22] dark:text-neutral-400 hover:text-black dark:hover:text-white'
                    }`}
                    title="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-rose-500 dark:text-rose-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Fabric & Delivery Technical Specs */}
              <div className="pt-3 border-t border-neutral-200 dark:border-[#27272A] text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
                <p>• <strong className="text-neutral-800 dark:text-neutral-300">Fabric:</strong> {product.fabric}</p>
                <p>• <strong className="text-neutral-800 dark:text-neutral-300">Care:</strong> {product.care}</p>
                <p>• <strong className="text-neutral-800 dark:text-neutral-300">Delivery:</strong> Narayanganj & Dhaka 24-48h (৳60) · Nationwide COD</p>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Sticky Bottom Action Bar (Thumb-accessible) */}
        <div className="sm:hidden p-3 border-t border-neutral-200 dark:border-[#27272A] bg-white dark:bg-[#141417] flex items-center gap-2 shadow-2xl pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)]">
          <button
            onClick={() => toggleWishlist(product)}
            className={`p-3 rounded-2xl border flex items-center justify-center transition-all cursor-pointer ${
              isWishlisted
                ? 'border-rose-500 bg-rose-50 text-rose-500 dark:border-rose-500/50 dark:bg-rose-500/20 dark:text-rose-400'
                : 'border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-[#27272A] dark:bg-[#1E1E22] dark:text-neutral-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-rose-500' : ''}`} />
          </button>

          <button
            onClick={handleAddToCart}
            className="flex-1 bg-neutral-900 hover:bg-black text-white dark:bg-[#F5EFEB] dark:text-black py-3 rounded-2xl text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-98"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Bag</span>
          </button>

          <button
            onClick={handleBuyNow}
            className="flex-1 bg-[#C5A059] hover:bg-[#b08e4d] text-black py-3 rounded-2xl text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-98"
          >
            <span>Buy Now</span>
          </button>
        </div>

      </div>
    </div>
  );
};
