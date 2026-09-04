import React from 'react';
import { useStore } from '../context/StoreContext';

export const CategoryBar = () => {
  const {
    PRODUCTS,
    selectedCategory,
    setSelectedCategory,
    setSearchQuery,
    theme,
  } = useStore();

  const isDark = theme === 'dark';

  const categories = [
    {
      id: 'all',
      label: 'All Items',
      count: PRODUCTS.length,
    },
    {
      id: 'Baby & Toddler',
      label: 'Baby (0–2Y)',
      count: PRODUCTS.filter(p => p.category === 'Baby & Toddler').length,
    },
    {
      id: 'Girls',
      label: 'Girls (2–8Y)',
      count: PRODUCTS.filter(p => p.category === 'Girls').length,
    },
    {
      id: 'Boys',
      label: 'Boys (2–8Y)',
      count: PRODUCTS.filter(p => p.category === 'Boys').length,
    },
    {
      id: 'Festive',
      label: 'Eid & Festive',
      count: PRODUCTS.filter(p => p.category === 'Festive').length,
    },
  ];

  const handleSelect = (id) => {
    setSelectedCategory(id);
    setSearchQuery('');
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={`border-b py-3 shadow-xs transition-colors duration-200 ${
      isDark ? 'bg-[#09090B] border-neutral-800/80' : 'bg-white border-neutral-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto pb-0.5 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all border cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'border-neutral-900 bg-neutral-900 text-white dark:border-[#F5EFEB] dark:bg-[#F5EFEB] dark:text-[#09090B] shadow-md'
                    : 'border-neutral-200 bg-neutral-100 text-neutral-600 hover:border-neutral-400 hover:text-black dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold font-mono ${
                  isActive
                    ? 'bg-white/20 text-white dark:bg-black/15 dark:text-black'
                    : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
