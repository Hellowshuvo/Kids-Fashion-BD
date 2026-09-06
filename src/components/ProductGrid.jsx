import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { RotateCcw, LayoutGrid, Grid3X3, RectangleHorizontal } from 'lucide-react';

export const ProductGrid = () => {
  const {
    PRODUCTS,
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    selectedSort,
    setSelectedSort,
    searchQuery,
    setSearchQuery,
    theme,
  } = useStore();

  const isDark = theme === 'dark';

  const [gridCols, setGridCols] = useState(4); // 2, 3, or 4 for desktop
  const [mobileCols, setMobileCols] = useState(2); // 1 or 2 for mobile

  const categories = [
    { id: 'all', label: 'All Items', count: PRODUCTS.length },
    { id: 'Baby & Toddler', label: 'Baby (0–2Y)', count: PRODUCTS.filter(p => p.category === 'Baby & Toddler' || p.categories?.includes('Baby & Toddler')).length },
    { id: 'Girls', label: 'Girls (2–8Y)', count: PRODUCTS.filter(p => p.category === 'Girls' || p.categories?.includes('Girls')).length },
    { id: 'Boys', label: 'Boys (2–8Y)', count: PRODUCTS.filter(p => p.category === 'Boys' || p.categories?.includes('Boys')).length },
    { id: 'Festive', label: 'Eid & Festive', count: PRODUCTS.filter(p => p.category === 'Festive' || p.categories?.includes('Festive')).length },
  ];

  const categoryDescriptions = {
    'all': 'Explore our complete curated collection of luxury organic clothing for children. Thoughtfully designed in Bangladesh using 100% combed organic cottons and pre-washed linens.',
    'Baby & Toddler': 'Specially crafted for newborns & toddlers (0–2 Years). Discover ultra-soft combed cottons, gentle seams, and effortless snaps for all-day comfort.',
    'Girls': 'Elegant essentials for girls (2–8 Years). From airy pre-washed linen flutter sundresses to floral cotton frocks and twirling pinafores.',
    'Boys': 'Comfortable adventures for boys (2–8 Years). Durable canvas play overalls, airy mandarin shirts, and sailor cotton sets.',
    'Festive': 'Celebrate in style with our Eid & Festive Wear. Featuring traditional handloom Tangail cotton panjabi sets and exquisitely embroidered pastel ensembles.',
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSort('featured');
    setSearchQuery('');
  };

  const hasFilter = selectedCategory !== 'all' || selectedSort !== 'featured' || Boolean(searchQuery);

  const getGridClass = () => {
    const mobileClass = mobileCols === 1 ? 'grid-cols-1' : 'grid-cols-2';
    if (gridCols === 4) return `${mobileClass} sm:grid-cols-3 lg:grid-cols-4`;
    if (gridCols === 3) return `${mobileClass} sm:grid-cols-2 lg:grid-cols-3`;
    return `${mobileClass} sm:grid-cols-2`;
  };

  return (
    <section id="catalog" className={`py-6 sm:py-14 border-b scroll-mt-16 text-left relative overflow-hidden transition-colors duration-200 ${
      isDark ? 'bg-[#09090B] border-neutral-800/80 text-white' : 'bg-white border-neutral-200 text-neutral-900'
    }`}>
      
      {/* Inline Styles for Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-5 sm:mb-8 pb-3 sm:pb-4 border-b border-neutral-200 dark:border-neutral-800/80 gap-3 sm:gap-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <span className="w-5 sm:w-6 h-[1.5px] bg-[#C5A059] rounded-full"></span>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] uppercase text-[#C5A059] font-mono">
                Curated Drops
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-1 sm:mb-2">
              {categories.find(c => c.id === selectedCategory)?.label || 'All Items'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl font-normal">
              {categoryDescriptions[selectedCategory] || categoryDescriptions['all']}
            </p>
          </div>

          {/* Filter, Sort & View Toggles */}
          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 sm:gap-3 xl:pb-1">
            
            {/* Product Count (Visible on mobile & desktop) */}
            <div className="text-[11px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wider font-mono">
              {filteredProducts.length} garments
            </div>

            {hasFilter && (
              <button
                onClick={resetFilters}
                className="text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-[#C5A059] flex items-center gap-1 cursor-pointer font-bold text-xs uppercase tracking-wider transition-colors px-2 py-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

            <div className="flex items-center bg-neutral-100 dark:bg-[#141417] border border-neutral-200 dark:border-neutral-800 rounded-full p-0.5 sm:p-1 shadow-xs ml-auto sm:ml-0">
              <div className="flex items-center px-2.5 sm:px-3 gap-1.5 sm:gap-2 border-r border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] uppercase text-neutral-500 font-bold tracking-widest hidden sm:inline-block">Sort</span>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="bg-transparent text-neutral-800 dark:text-neutral-200 text-xs font-medium focus:outline-none cursor-pointer pr-1 py-1"
                >
                  <option value="featured" className="bg-white dark:bg-[#141417] text-neutral-900 dark:text-white">Featured</option>
                  <option value="price-low" className="bg-white dark:bg-[#141417] text-neutral-900 dark:text-white">Price: Low to High</option>
                  <option value="price-high" className="bg-white dark:bg-[#141417] text-neutral-900 dark:text-white">Price: High to Low</option>
                  <option value="rating" className="bg-white dark:bg-[#141417] text-neutral-900 dark:text-white">Top Rated</option>
                </select>
              </div>

              {/* Mobile 1-col vs 2-col View Switcher */}
              <div className="flex sm:hidden items-center pl-1 pr-0.5 gap-0.5">
                <button
                  onClick={() => setMobileCols(1)}
                  aria-label="1 Column Large View"
                  className={`p-1.5 rounded-full transition-all cursor-pointer ${
                    mobileCols === 1
                      ? 'bg-white text-black shadow-xs dark:bg-[#27272A] dark:text-white'
                      : 'text-neutral-400 hover:text-black dark:text-neutral-500 dark:hover:text-white'
                  }`}
                  title="Single card view"
                >
                  <RectangleHorizontal className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setMobileCols(2)}
                  aria-label="2 Columns Grid View"
                  className={`p-1.5 rounded-full transition-all cursor-pointer ${
                    mobileCols === 2
                      ? 'bg-white text-black shadow-xs dark:bg-[#27272A] dark:text-white'
                      : 'text-neutral-400 hover:text-black dark:text-neutral-500 dark:hover:text-white'
                  }`}
                  title="2-column grid view"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Desktop View Grid Switcher */}
              <div className="hidden sm:flex items-center pl-1 pr-0.5 gap-0.5">
                <button
                  onClick={() => setGridCols(2)}
                  aria-label="2 Columns View"
                  className={`p-1.5 rounded-full transition-all cursor-pointer ${
                    gridCols === 2
                      ? 'bg-white text-black shadow-xs dark:bg-[#27272A] dark:text-white'
                      : 'text-neutral-400 hover:text-black dark:text-neutral-500 dark:hover:text-white'
                  }`}
                  title="Large 2-column view"
                >
                  <RectangleHorizontal className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setGridCols(3)}
                  aria-label="3 Columns View"
                  className={`p-1.5 rounded-full transition-all cursor-pointer ${
                    gridCols === 3
                      ? 'bg-white text-black shadow-xs dark:bg-[#27272A] dark:text-white'
                      : 'text-neutral-400 hover:text-black dark:text-neutral-500 dark:hover:text-white'
                  }`}
                  title="Medium 3-column view"
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setGridCols(4)}
                  aria-label="4 Columns View"
                  className={`p-1.5 rounded-full transition-all cursor-pointer ${
                    gridCols === 4
                      ? 'bg-white text-black shadow-xs dark:bg-[#27272A] dark:text-white'
                      : 'text-neutral-400 hover:text-black dark:text-neutral-500 dark:hover:text-white'
                  }`}
                  title="Compact 4-column view"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className={`grid ${getGridClass()} gap-4 sm:gap-6`}>
            {filteredProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                style={{
                  animation: `fadeInUp 0.4s ease-out ${Math.min(idx * 0.05, 0.4)}s both`
                }}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="py-20 text-center space-y-4 bg-neutral-50 dark:bg-[#141417] rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
              <RotateCcw className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider">No matching garments found</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto mt-1 leading-relaxed">
                We couldn't find any pieces matching your current filters or search terms.
              </p>
            </div>
            <button
              onClick={resetFilters}
              className="bg-neutral-900 hover:bg-black text-white dark:bg-[#F5EFEB] dark:hover:bg-white dark:text-black text-xs px-6 py-2.5 rounded-full uppercase tracking-wider font-bold transition-all shadow-md cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
