import { useStore } from '../context/StoreContext';

export const AtelierShowcase = () => {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <section className={`py-12 sm:py-16 border-b transition-colors duration-200 ${
      isDark ? 'bg-[#09090B] border-neutral-800/80 text-white' : 'bg-white border-neutral-200 text-neutral-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Frame */}
        <div className={`overflow-hidden rounded-2xl sm:rounded-3xl border transition-all duration-300 shadow-xl ${
          isDark ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-neutral-50'
        }`}>
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <img
              src="/kids-fashion-bd-cards.jpg"
              alt="Kids Fashion BD Atelier Cards"
              className="w-full h-full object-cover object-center hover:scale-[1.01] transition-transform duration-700 ease-out"
            />
          </div>
        </div>

      </div>
    </section>
  );
};
