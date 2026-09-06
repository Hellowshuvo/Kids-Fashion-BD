import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  CheckCircle2,
  Printer,
  ShoppingBag,
  Clock,
  X,
} from 'lucide-react';

export const OrderSuccessModal = () => {
  const { lastOrder, setLastOrder, formatPrice } = useStore();

  if (!lastOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppHelp = () => {
    const text = encodeURIComponent(`Assalamu Alaikum Kids Fashion BD! I placed order #${lastOrder.orderId} (${formatPrice(lastOrder.total)}). Could you please confirm delivery details?`);
    window.open(`https://wa.me/8801712894200?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        onClick={() => setLastOrder(null)}
      />

      {/* Modal Card */}
      <div className="relative bg-white dark:bg-[#141417] text-neutral-900 dark:text-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full flex flex-col max-h-[95vh] sm:max-h-[85vh] overflow-hidden shadow-2xl border-t sm:border border-neutral-200 dark:border-[#27272A] z-10 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 text-left">
        
        {/* Mobile Pull Bar */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center">
          <div className="w-10 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full" />
        </div>

        {/* Top celebratory header */}
        <div className="bg-neutral-50 dark:bg-[#09090B] p-5 sm:p-8 text-center border-b border-neutral-200 dark:border-[#27272A] relative">
          <button
            onClick={() => setLastOrder(null)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 text-neutral-400 hover:text-black dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-[#27272A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-full bg-white dark:bg-[#1E1E22] border border-neutral-200 dark:border-[#C5A059]/40 shadow-xs flex items-center justify-center mx-auto text-[#C5A059] mb-3">
            <CheckCircle2 className="w-7 h-7 text-[#C5A059]" />
          </div>

          <span className="text-[11px] uppercase tracking-widest font-bold text-[#C5A059] font-mono">
            Order Confirmed • Kids Fashion BD
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white font-serif mt-1">
            Thank you, {lastOrder.customer.name}
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 max-w-md mx-auto">
            Your bespoke order is being prepared. Confirmation sent to{' '}
            <strong className="text-neutral-900 dark:text-white font-mono">+880 {lastOrder.customer.phone}</strong>.
          </p>

          <div className="inline-flex items-center gap-2 mt-4 px-3.5 py-1.5 bg-white dark:bg-[#1E1E22] rounded-full border border-neutral-200 dark:border-[#27272A] text-xs font-mono">
            <span className="text-neutral-500 dark:text-neutral-400">Order ID:</span>
            <span className="font-bold text-neutral-900 dark:text-[#F5EFEB]">{lastOrder.orderId}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto space-y-6">
          
          {/* Tracking Progression */}
          <div className="p-4 bg-neutral-50 dark:bg-[#09090B] rounded-2xl border border-neutral-200 dark:border-[#27272A]">
            <h4 className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Estimated Delivery: <strong className="text-neutral-900 dark:text-white">{lastOrder.estimatedDelivery}</strong></span>
            </h4>

            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#1E1E22] border border-neutral-200 dark:border-[#27272A] shadow-xs">
                <div className="w-2 h-2 rounded-full bg-[#C5A059] mx-auto mb-1" />
                <span className="font-bold text-neutral-900 dark:text-white block">1. Confirmed</span>
                <span className="text-neutral-500 text-[10px]">Just now</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/60 dark:bg-[#141417] border border-neutral-200 dark:border-[#27272A]">
                <div className="w-2 h-2 rounded-full bg-[#C5A059]/50 mx-auto mb-1 animate-pulse" />
                <span className="font-medium text-neutral-700 dark:text-neutral-300 block">2. Tailoring</span>
                <span className="text-neutral-500 text-[10px]">Narayanganj Studio</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/60 dark:bg-[#141417] border border-neutral-200 dark:border-[#27272A]">
                <div className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-[#27272A] mx-auto mb-1" />
                <span className="font-medium text-neutral-400 dark:text-neutral-500 block">3. Dispatched</span>
                <span className="text-neutral-400 dark:text-neutral-600 text-[10px]">Courier</span>
              </div>
            </div>
          </div>

          {/* Items Purchased List */}
          <div>
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-3 font-mono">
              Items Ordered ({lastOrder.items.length})
            </h4>

            <div className="divide-y divide-neutral-200 dark:divide-[#27272A] border-t border-b border-neutral-200 dark:border-[#27272A]">
              {lastOrder.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt=""
                      className="w-12 h-14 rounded-lg object-cover bg-neutral-100 dark:bg-[#1E1E22] border border-neutral-200 dark:border-[#27272A]"
                    />
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white">{item.product.name}</p>
                      <p className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                        Size: {item.size} • Color: {item.color.name} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-neutral-900 dark:text-[#F5EFEB]">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Payment Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-neutral-50 dark:bg-[#09090B] rounded-xl border border-neutral-200 dark:border-[#27272A] space-y-1">
              <span className="font-semibold text-neutral-900 dark:text-white block uppercase tracking-wider text-[10px] mb-1 font-mono">Delivery Details:</span>
              <p className="text-neutral-800 dark:text-neutral-200 font-medium">{lastOrder.customer.name}</p>
              <p className="text-neutral-600 dark:text-neutral-400">{lastOrder.customer.address}</p>
              <p className="text-neutral-600 dark:text-neutral-400">
                {lastOrder.customer.cityArea}, {lastOrder.customer.division}
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 font-mono">Phone: +880 {lastOrder.customer.phone}</p>
            </div>

            <div className="p-3.5 bg-neutral-50 dark:bg-[#09090B] rounded-xl border border-neutral-200 dark:border-[#27272A] space-y-1">
              <span className="font-semibold text-neutral-900 dark:text-white block uppercase tracking-wider text-[10px] mb-1 font-mono">Payment Summary:</span>
              <p className="text-neutral-800 dark:text-neutral-200">{lastOrder.payment.method}</p>
              <p className="text-[#C5A059] font-medium">{lastOrder.payment.status}</p>
              <div className="pt-2 mt-2 border-t border-neutral-200 dark:border-[#27272A] flex justify-between font-bold text-neutral-900 dark:text-white">
                <span className="uppercase text-[11px]">Grand Total:</span>
                <span className="font-mono text-sm text-neutral-900 dark:text-[#F5EFEB]">{formatPrice(lastOrder.total)}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5 pb-[env(safe-area-inset-bottom,0px)]">
            <button
              onClick={handleWhatsAppHelp}
              className="w-full sm:w-auto px-5 py-3 rounded-full border border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <span>💬 Track via WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-5 py-3 rounded-full border border-neutral-300 dark:border-[#27272A] text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#1E1E22] hover:text-black dark:hover:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-neutral-500" />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={() => setLastOrder(null)}
              className="flex-1 w-full bg-neutral-900 text-white hover:bg-black dark:bg-[#F5EFEB] dark:text-black dark:hover:bg-white py-3.5 px-6 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
            >
              <ShoppingBag className="w-4 h-4 text-white dark:text-black" />
              <span>Continue Shopping</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
