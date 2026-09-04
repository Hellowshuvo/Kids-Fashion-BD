import React from 'react';

export const FeaturesBanner = () => {
  const features = [
    '100% Organic Cotton',
    'Dhaka 24–48h Delivery',
    'Cash on Delivery & bKash',
    '7-Day Gentle Exchange',
  ];

  return (
    <section className="bg-white border-b border-neutral-100 py-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 text-center">
          {features.map((item, idx) => (
            <div key={idx} className="flex-1 min-w-[140px] text-center">
              <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

