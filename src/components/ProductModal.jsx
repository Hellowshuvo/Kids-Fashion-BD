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
    setIsCartOpen,
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
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setActiveQuickView(null);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="fixed inset-0" onClick={() => setActiveQuickView(null)} />

      <div className="relative bg-white dark:bg-[#141417] text-neutral-900 dark:text-white rounded-3xl max-w-3xl w-full border border-neutral-200 dark:border-[#27272A] z-10 text-left shadow-2xl overflow-hidden">
        <button
          onClick={() => setActiveQuickView(null)}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 p-2 text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white bg-white/90 dark:bg-[#1E1E22]/90 rounded-full hover:bg-neutral-100 dark:hover:bg-[#27272A] transition-colors cursor-pointer border border-neutral-200 dark:border-[#27272A]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Left: Product Image */}
          <div className="bg-neutral-50 dark:bg-[#09090B] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-200 dark:border-[#27272A]">
            <div className="w-full aspect-[3/4] bg-white dark:bg-[#141417] rounded-2xl border border-neutral-200 dark:border-[#27272A] overflow-hidden relative shadow-xs">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex items-center gap-2 mt-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
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
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#C5A059] font-bold block mb-1 font-mono">
                  {product.category} · {product.ageBracket}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white font-serif">
                  {product.name}
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">{product.tagline}</p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 py-1">
                <span className="text-2xl font-extrabold text-neutral-900 dark:text-[#F5EFEB] font-mono">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-neutral-400 dark:text-neutral-500 line-through font-mono">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Color */}
              <div>
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                  Color: <span className="font-normal text-neutral-500 dark:text-neutral-400">{selectedColor?.name}</span>
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
                        selectedColor?.name === color.name
                          ? 'border-[#C5A059] bg-neutral-100 dark:bg-[#1E1E22] text-neutral-900 dark:text-white shadow-xs font-medium'
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

              {/* Size */}
              <div>
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                  Size: <span className="font-normal text-neutral-500 dark:text-neutral-400">{selectedSize}</span>
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

              {/* Action buttons */}
              <div className="flex items-center gap-2.5 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-neutral-900 hover:bg-black text-white dark:bg-[#F5EFEB] dark:hover:bg-white dark:text-black py-3.5 rounded-full text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
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
            <div className="pt-4 border-t border-neutral-200 dark:border-[#27272A] text-xs text-neutral-500 dark:text-neutral-400 space-y-1.5">
              <p>• <strong className="text-neutral-800 dark:text-neutral-300">Fabric:</strong> {product.fabric}</p>
              <p>• <strong className="text-neutral-800 dark:text-neutral-300">Care:</strong> {product.care}</p>
              <p>• <strong className="text-neutral-800 dark:text-neutral-300">Narayanganj & Dhaka Delivery:</strong> 24-48h (৳60) · Cash on Delivery available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
