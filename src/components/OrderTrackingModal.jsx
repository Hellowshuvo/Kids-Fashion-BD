import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Search, PackageCheck, Truck, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const OrderTrackingModal = () => {
  const { isTrackingOpen, setIsTrackingOpen, formatPrice, showToast, theme } = useStore();
  const isDark = theme === 'dark';

  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isTrackingOpen) return null;

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim() || !phone.trim()) {
      showToast('Please enter both Order ID and Phone Number', 'error');
      return;
    }

    setIsSearching(true);
    setErrorMessage('');
    setOrderData(null);

    try {
      const res = await fetch(`/api/orders/track?orderId=${encodeURIComponent(orderId.trim())}&phone=${encodeURIComponent(phone.trim())}`);
      const data = await res.json();
      if (res.ok && data.status && data.order) {
        setOrderData(data.order);
      } else {
        setErrorMessage(data.message || 'No matching order found. Please verify your details.');
      }
    } catch (err) {
      setErrorMessage('Connection error. Please try again later.');
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusStep = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'delivered') return 4;
    if (s === 'shipped') return 3;
    if (s === 'processing') return 2;
    return 1; // Pending
  };

  const currentStep = orderData ? getStatusStep(orderData.status) : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={() => setIsTrackingOpen(false)} />

      <div className={`relative w-full max-w-xl rounded-3xl border shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto text-left transition-colors duration-200 ${
        isDark ? 'bg-[#141417] border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
      }`}>
        <button
          onClick={() => setIsTrackingOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Truck className="w-4 h-4 text-[#C5A059]" />
          <span className="text-[11px] uppercase tracking-widest font-bold text-[#C5A059] font-mono">
            Live Order Tracking
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-1 font-serif">
          Track Your Delivery
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
          Enter your Order ID (from confirmation or SMS) and Phone Number used during checkout.
        </p>

        <form onSubmit={handleTrack} className="space-y-3 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                Order ID
              </label>
              <input
                type="text"
                required
                placeholder="e.g. KB-123456"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                className="w-full bg-neutral-50 dark:bg-[#09090B] border border-neutral-300 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white font-mono uppercase focus:outline-none focus:border-[#C5A059]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                placeholder="01842533335"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-[#09090B] border border-neutral-300 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white font-mono focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="w-full bg-neutral-900 text-white dark:bg-[#F5EFEB] dark:text-black py-2.5 rounded-full text-xs uppercase tracking-wider font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Locating Order...</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>Search Order</span>
              </>
            )}
          </button>
        </form>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2 mb-4 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {orderData && (
          <div className="space-y-5 animate-in fade-in zoom-in-95">
            {/* Status Timeline */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#09090B] border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between text-xs mb-4">
                <span className="font-mono text-neutral-500">Order #{orderData.orderId}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  orderData.status === 'Delivered'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : orderData.status === 'Shipped'
                    ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                }`}>
                  {orderData.status}
                </span>
              </div>

              {/* Progress Stepper */}
              <div className="grid grid-cols-4 gap-1 text-center text-[10px] relative mb-2">
                {[
                  { title: 'Received', step: 1 },
                  { title: 'Processing', step: 2 },
                  { title: 'Shipped', step: 3 },
                  { title: 'Delivered', step: 4 },
                ].map((s) => (
                  <div key={s.step} className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] mb-1 transition-colors ${
                      currentStep >= s.step
                        ? 'bg-[#C5A059] text-black shadow-xs'
                        : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'
                    }`}>
                      {currentStep > s.step ? '✓' : s.step}
                    </div>
                    <span className={`font-medium ${currentStep >= s.step ? 'text-[#C5A059]' : 'text-neutral-400'}`}>
                      {s.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Details */}
            <div className="space-y-3 text-xs border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Customer:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{orderData.customer?.name}</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Delivery Address:</span>
                <span className="font-semibold text-neutral-900 dark:text-white text-right max-w-xs">{orderData.customer?.address}, {orderData.customer?.cityArea}</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Payment:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{orderData.payment?.method} ({orderData.payment?.status})</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Order Total:</span>
                <span className="font-bold text-base font-mono text-[#C5A059]">{formatPrice(orderData.total)}</span>
              </div>

              {/* Items List */}
              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="text-[11px] font-bold uppercase text-neutral-500">Ordered Garments ({orderData.items?.length || 0}):</div>
                {orderData.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1">
                    <div>
                      <span className="font-medium text-neutral-900 dark:text-white">{item.product?.name || 'Garment'}</span>
                      <span className="text-[11px] text-neutral-500 block">Size: {item.size} • Color: {item.color?.name || 'Standard'} • Qty: {item.quantity}</span>
                    </div>
                    <span className="font-mono text-neutral-700 dark:text-neutral-300">{formatPrice((item.product?.price || 0) * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
