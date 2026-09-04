import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Heart, Plus, Star } from 'lucide-react';

const getBadgeStyles = (badge) => {
  if (!badge) return '';
  const text = badge.toLowerCase();
  if (text.includes('bestseller')) return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800/50';
  if (text.includes('new')) return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/80 dark:text-sky-300 dark:border-sky-800/50';
  if (text.includes('organic')) return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800/50';
  if (text.includes('festive')) return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800/50';
  return 'bg-neutral-900 text-white border-neutral-700';
};

export const ProductCard = ({ product, style }) => {
  const {
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setActiveQuickView,
  } = useStore();

  const [isWishlistAnimating, setIsWishlistAnimating] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  
  const handleWishlistClick = (e) => {
    e.stopPropagation();
    setIsWishlistAnimating(true);
    toggleWishlist(product);
    setTimeout(() => setIsWishlistAnimating(false), 300);
  };

  return (
    <div 
      style={style}
      className="group text-left flex flex-col justify-between rounded-2xl border border-neutral-200 dark:border-neutral-800/80 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-[#141417] p-3 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-black/60 transition-all duration-300 ease-out"
    >
      
      {/* 3:4 Aspect Ratio Fashion Image with Rounded Corners */}
      <div
        onClick={() => setActiveQuickView(product)}
        className="relative w-full aspect-[3/4] overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900 cursor-pointer group/image"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover/image:scale-105 brightness-95 ${product.images[1] ? 'group-hover/image:opacity-0' : ''}`}
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover/image:opacity-100 group-hover/image:scale-105 transition-all duration-700 ease-out brightness-95"
          />
        )}

        {/* Sold Out Overlay */}
        {product.inStock === false && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-neutral-700">
              Sold Out
            </span>
          </div>
        )}

        {/* Badge */}
        {product.badge && product.inStock !== false && (
          <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs border backdrop-blur-md ${getBadgeStyles(product.badge)}`}>
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
          className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm z-20 ${
            isWishlisted
              ? 'bg-[#C5A059] text-black'
              : 'bg-white/80 dark:bg-black/60 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border border-neutral-200 dark:border-white/10 hover:bg-white dark:hover:bg-black'
          } ${isWishlistAnimating ? 'scale-75' : 'scale-100 hover:scale-110'}`}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add Bar sliding from bottom */}
        <div className="absolute inset-x-3 bottom-3 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out hidden sm:block z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (product.inStock !== false) {
                addToCart(product, product.sizes[0], product.colors[0], 1);
              }
            }}
            disabled={product.inStock === false}
            className="w-full bg-neutral-900 hover:bg-black text-white dark:bg-[#F5EFEB] dark:hover:bg-white dark:text-[#09090B] py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all cursor-pointer shadow-lg flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{product.inStock === false ? 'Out of Stock' : 'Quick Add'}</span>
          </button>
        </div>
      </div>

      {/* Garment Details & Pricing */}
      <div className="pt-3 pb-1 px-1 flex flex-col justify-between flex-1">
        <div>
          {/* Department & Age Tag */}
          <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-medium mb-1">
            <span>{product.category}</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-[#C5A059] text-[#C5A059]" />
              <span className="text-neutral-800 dark:text-neutral-300 font-semibold">{product.rating || '4.9'}</span>
              <span className="text-neutral-400 dark:text-neutral-500">({product.reviewsCount || 24})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => setActiveQuickView(product)}
            className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white hover:text-[#C5A059] cursor-pointer line-clamp-1 transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Colors Dots & Sizes */}
          <div className="flex items-center justify-between mt-1.5">
            <div className="flex items-center gap-1">
              {product.colors && product.colors.slice(0, 3).map((color, idx) => (
                <div
                  key={idx}
                  className="w-2.5 h-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 shadow-2xs"
                  style={{ backgroundColor: color.hex || '#E5E5E5' }}
                  title={color.name || ''}
                />
              ))}
              {product.colors && product.colors.length > 3 && (
                <span className="text-[10px] text-neutral-500 ml-0.5 font-medium">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
            
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium tracking-wide">
              {product.sizes[0]} - {product.sizes[product.sizes.length - 1]}
            </p>
          </div>
        </div>

        {/* Price & Mobile Add */}
        <div className="pt-2 mt-2 border-t border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-[#F5EFEB]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] text-neutral-400 dark:text-neutral-500 line-through font-medium">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={() => product.inStock !== false && addToCart(product, product.sizes[0], product.colors[0], 1)}
            aria-label="Add to cart"
            disabled={product.inStock === false}
            className="sm:hidden bg-neutral-900 text-white dark:bg-[#F5EFEB] dark:text-[#09090B] p-1.5 rounded-lg hover:opacity-90 transition-colors cursor-pointer shadow-md disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
