import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight } from 'lucide-react';

export const Categories = () => {
  const { setSelectedCategory } = useStore();

  const categories = [
    {
      id: 'baby',
      name: 'BABY & TODDLER',
      age: '0–2 YEARS',
      description: 'Organic cotton rompers, bodysuits & cozy knitted essentials.',
      category: 'Baby & Toddler',
      image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'girls',
      name: 'GIRLS COLLECTION',
      age: '2–8 YEARS',
      description: 'Pure washed linen flutter dresses, pastel blouses & skirts.',
      category: 'Girls',
      image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'boys',
      name: 'BOYS COLLECTION',
      age: '2–8 YEARS',
      description: 'Durable canvas overalls, band-collar shirts & relaxed trousers.',
      category: 'Boys',
      image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-white py-14 sm:py-20 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-left mb-8 sm:mb-12 pb-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] uppercase text-neutral-400 block mb-1">
              Curated Departments
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-wider uppercase text-black">
              Shop By Category
            </h2>
          </div>
          <span className="text-xs text-neutral-400">
            Ages 0 to 8 Years
          </span>
        </div>

        {/* 3 Strict Uniform Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.category)}
              className="group cursor-pointer text-left flex flex-col justify-between"
            >
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-neutral-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500 ease-out"
                />
                <span className="absolute top-3 left-3 bg-white text-black text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 border border-neutral-200">
                  {cat.age}
                </span>
              </div>

              <div className="pt-4 pb-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold tracking-wider uppercase text-black group-hover:opacity-60 transition-opacity">
                    {cat.name}
                  </h3>
                  <ArrowRight className="w-3.5 h-3.5 text-black -translate-x-1 group-hover:translate-x-0 transition-transform" />
                </div>
                <p className="text-xs text-neutral-400 mt-1 font-normal line-clamp-1">
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
