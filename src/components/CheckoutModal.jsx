import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import confetti from 'canvas-confetti';
import {
  X,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Loader2,
} from 'lucide-react';

export const CheckoutModal = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    discountAmount,
    shippingFee,
    grandTotal,
    formatPrice,
    deliveryRegion,
    setDeliveryRegion,
    clearCart,
    setLastOrder,
    showToast,
  } = useStore();

  const [step, setStep] = useState(1); // 1: Delivery info, 2: Payment & Review
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    division: 'Dhaka',
    cityArea: '',
    streetAddress: '',
    notes: '',
    paymentMethod: 'online', // 'online' (UddoktaPay), 'cod', 'bkash'
    bkashNumber: '',
    trxId: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });
  const [copiedNumber, setCopiedNumber] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      showToast('Please enter a valid Bangladesh phone number', 'error');
      return;
    }
    if (!formData.streetAddress.trim()) {
      showToast('Please enter your street address', 'error');
      return;
    }
    setStep(2);
  };

  const copyMerchantNumber = () => {
    try {
      navigator.clipboard.writeText('01712894200');
      setCopiedNumber(true);
      showToast('Merchant number 01712-894200 copied!', 'success');
      setTimeout(() => setCopiedNumber(false), 2500);
    } catch (e) {
      showToast('Merchant number: 01712-894200', 'info');
    }
  };

  const handleWhatsAppOrder = () => {
    const itemsSummary = cart.map(i => `${i.product.name} (${i.size}, ${i.color.name}) x${i.quantity}`).join(', ');
    const text = encodeURIComponent(`Assalamu Alaikum Kids Fashion BD! I would like to place an order from my phone:\n\n🛍️ Items: ${itemsSummary}\n💰 Total: ৳${grandTotal}\n👤 Name: ${formData.fullName || 'Not provided'}\n📱 Phone: ${formData.phone || 'Not provided'}\n📍 Address: ${formData.streetAddress || ''} ${formData.cityArea || ''} ${formData.division}\n💳 Preferred Payment: ${formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'bKash/Nagad'}`);
    window.open(`https://wa.me/8801712894200?text=${text}`, '_blank');
  };

  const fillSampleTrxId = () => {
    setFormData((prev) => ({
      ...prev,
      bkashNumber: prev.phone || '01712894200',
      trxId: 'BKL' + Math.floor(10000000 + Math.random() * 90000000),
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // 1. ONLINE PAYMENT VIA UDDOKTAPAY / PAYMENTLY GATEWAY
    if (formData.paymentMethod === 'online') {
      setIsSubmitting(true);
      const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
      const customerEmail = formData.email?.trim() || `${cleanPhone || 'customer'}@kidsfashionbd.com`;
      const orderId = 'KB-' + Math.floor(100000 + Math.random() * 900000);

      const pendingOrder = {
        orderId,
        date: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        customer: {
          name: formData.fullName,
          phone: formData.phone,
          email: formData.email || 'N/A',
          division: formData.division,
          cityArea: formData.cityArea,
          address: formData.streetAddress,
          notes: formData.notes,
        },
        payment: {
          method: 'Online Payment (UddoktaPay)',
          status: 'Payment Pending Confirmation',
        },
        items: [...cart],
        subtotal: cartSubtotal,
        discount: 0,
        promoCode: null,
        shipping: shippingFee,
        total: grandTotal,
        estimatedDelivery:
          deliveryRegion === 'dhaka'
            ? 'Within 24 to 48 Hours'
            : 'Within 3 to 5 Business Days',
      };

      try {
        localStorage.setItem('kfb_pending_order', JSON.stringify(pendingOrder));

        const origin = window.location.origin;
        const res = await fetch('/api/payment/create-charge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: customerEmail,
            amount: grandTotal,
            metadata: {
              order_id: orderId,
              phone: formData.phone,
            },
            redirectUrl: `${origin}/?payment_status=success`,
            cancelUrl: `${origin}/?payment_status=cancel`,
          }),
        });

        if (!res.ok) {
          const errText = await res.text().catch(() => '');
          let errMsg = 'Could not initiate payment gateway.';
          try {
            const errJson = JSON.parse(errText);
            errMsg = errJson.message || errMsg;
          } catch (e) {
            errMsg = errText || `Server responded with status ${res.status}`;
          }
          showToast(errMsg, 'error');
          setIsSubmitting(false);
          return;
        }

        const json = await res.json();
        const data = json.data || json;

        if (data.status && data.payment_url) {
          showToast('Redirecting to UddoktaPay secure checkout...', 'info');
          window.location.href = data.payment_url;
          return;
        } else {
          showToast(data.message || 'Could not initiate online payment gateway', 'error');
          setIsSubmitting(false);
        }
      } catch (err) {
        showToast(err.message || 'Server connection error. Please try again.', 'error');
        setIsSubmitting(false);
      }
      return;
    }

    // 2. MANUAL BKASH TRANSFER
    if (formData.paymentMethod === 'bkash') {
      if (!formData.trxId || formData.trxId.length < 6) {
        showToast('Please enter the bKash/Nagad Transaction ID (TrxID)', 'error');
        return;
      }
    }

    // 3. CASH ON DELIVERY OR MANUAL
    setIsSubmitting(true);

    setTimeout(() => {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // Ignored if confetti fails
      }

      const generatedOrder = {
        orderId: 'KB-' + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        customer: {
          name: formData.fullName,
          phone: formData.phone,
          email: formData.email || 'N/A',
          division: formData.division,
          cityArea: formData.cityArea,
          address: formData.streetAddress,
          notes: formData.notes,
        },
        payment: {
          method:
            formData.paymentMethod === 'cod'
              ? 'Cash on Delivery (COD)'
              : formData.paymentMethod === 'bkash'
              ? `bKash / Nagad Manual (TrxID: ${formData.trxId})`
              : 'Credit / Debit Card',
          status: formData.paymentMethod === 'cod' ? 'Payment Due upon Delivery' : 'Paid',
        },
        items: [...cart],
        subtotal: cartSubtotal,
        discount: 0,
        promoCode: null,
        shipping: shippingFee,
        total: grandTotal,
        estimatedDelivery:
          deliveryRegion === 'dhaka'
            ? 'Within 24 to 48 Hours'
            : 'Within 3 to 5 Business Days',
      };

      setLastOrder(generatedOrder);
      clearCart();
      setIsSubmitting(false);
      setIsCheckoutOpen(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        onClick={() => !isSubmitting && setIsCheckoutOpen(false)}
      />

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-[#141417] text-neutral-900 dark:text-white rounded-t-3xl sm:rounded-3xl max-w-3xl w-full flex flex-col max-h-[96vh] sm:max-h-[85vh] overflow-hidden shadow-2xl border-t sm:border border-neutral-200 dark:border-[#27272A] z-10 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 text-left">
        
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center">
          <div className="w-10 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-neutral-200 dark:border-[#27272A] flex items-center justify-between bg-white dark:bg-[#141417]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#C5A059]" />
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-white">
              Secure Checkout • Kids Fashion BD
            </span>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            disabled={isSubmitting}
            aria-label="Close checkout"
            className="p-1.5 text-neutral-400 hover:text-black dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-[#27272A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Indicator */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-neutral-50 dark:bg-[#09090B] border-b border-neutral-200 dark:border-[#27272A] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                step >= 1
                  ? 'bg-neutral-900 text-white dark:bg-[#F5EFEB] dark:text-black'
                  : 'bg-neutral-200 text-neutral-600 dark:bg-[#27272A] dark:text-neutral-500'
              }`}
            >
              1
            </span>
            <span className={`font-medium ${step === 1 ? 'text-neutral-900 dark:text-white' : 'text-neutral-400 dark:text-neutral-500'}`}>
              Delivery Details
            </span>
          </div>

          <div className="w-12 h-px bg-neutral-200 dark:bg-[#27272A]" />

          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                step === 2
                  ? 'bg-neutral-900 text-white dark:bg-[#F5EFEB] dark:text-black'
                  : 'bg-neutral-200 text-neutral-600 dark:bg-[#27272A] dark:text-neutral-500'
              }`}
            >
              2
            </span>
            <span className={`font-medium ${step === 2 ? 'text-neutral-900 dark:text-white' : 'text-neutral-400 dark:text-neutral-500'}`}>
              Payment & Confirm
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-8 overflow-y-auto flex-1 overscroll-contain">
          
          {/* STEP 1: Shipping Information */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              
              {/* Quick WhatsApp Order Callout on Mobile */}
              <div className="sm:hidden p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-2">
                <div className="text-xs text-emerald-800 dark:text-emerald-300">
                  <p className="font-bold">Ordering from phone?</p>
                  <p className="text-[11px] opacity-90">Skip the form & order via WhatsApp in 1 tap</p>
                </div>
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap active:scale-95 transition-transform cursor-pointer shadow-xs"
                >
                  💬 WhatsApp
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanzeem Farooq"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#1E1E22] border border-neutral-200 dark:border-[#27272A] rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-[#C5A059] transition-all"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Phone Number (for Courier Delivery) *
                  </label>
                  <div className="flex items-center">
                    <span className="bg-neutral-200 dark:bg-[#27272A] border border-r-0 border-neutral-200 dark:border-[#27272A] rounded-l-xl px-2.5 py-2.5 text-xs font-mono text-neutral-600 dark:text-neutral-400">
                      +880
                    </span>
                    <input
                      type="tel"
                      inputMode="tel"
                      required
                      placeholder="01712345678"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-[#1E1E22] border border-neutral-200 dark:border-[#27272A] rounded-r-xl px-3.5 py-2.5 text-base sm:text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-[#C5A059] transition-all"
                    />
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                
                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#1E1E22] border border-neutral-200 dark:border-[#27272A] rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-[#C5A059] transition-all"
                  />
                </div>

                {/* Division */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Division *
                  </label>
                  <select
                    value={formData.division}
                    onChange={(e) => {
                      const div = e.target.value;
                      handleInputChange('division', div);
                      setDeliveryRegion(div === 'Dhaka' ? 'dhaka' : 'outside');
                    }}
                    className="w-full bg-neutral-50 dark:bg-[#1E1E22] border border-neutral-200 dark:border-[#27272A] rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#C5A059] transition-all"
                  >
                    <option value="Dhaka" className="bg-white dark:bg-[#141417]">Dhaka / Narayanganj (24-48h Delivery)</option>
                    <option value="Chattogram" className="bg-white dark:bg-[#141417]">Chattogram (3-4 Days)</option>
                    <option value="Sylhet" className="bg-white dark:bg-[#141417]">Sylhet</option>
                    <option value="Rajshahi" className="bg-white dark:bg-[#141417]">Rajshahi</option>
                    <option value="Khulna" className="bg-white dark:bg-[#141417]">Khulna</option>
                    <option value="Barishal" className="bg-white dark:bg-[#141417]">Barishal</option>
                    <option value="Rangpur" className="bg-white dark:bg-[#141417]">Rangpur</option>
                    <option value="Mymensingh" className="bg-white dark:bg-[#141417]">Mymensingh</option>
                  </select>
                </div>

              </div>

              {/* Area / Thana */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  City Area / Thana *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Katherpool, Shibu Market, Uttara, Dhanmondi..."
                  value={formData.cityArea}
                  onChange={(e) => handleInputChange('cityArea', e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#1E1E22] border border-neutral-200 dark:border-[#27272A] rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-[#C5A059] transition-all"
                />
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Full Street Address & House / Flat No. *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="House 24, Road 7, Block D, Apt 4B..."
                  value={formData.streetAddress}
                  onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#1E1E22] border border-neutral-200 dark:border-[#27272A] rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-[#C5A059] transition-all"
                />
              </div>

              {/* Delivery Notes */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Special Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Please call before delivery"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#1E1E22] border border-neutral-200 dark:border-[#27272A] rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-[#C5A059] transition-all"
                />
              </div>

              {/* Step 1 Next Button */}
              <div className="pt-4 flex items-center justify-between border-t border-neutral-200 dark:border-[#27272A] pb-[env(safe-area-inset-bottom,0px)]">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  Total: <strong className="text-neutral-900 dark:text-[#F5EFEB] font-mono text-sm ml-1">{formatPrice(grandTotal)}</strong>
                </span>
                <button
                  type="submit"
                  className="bg-neutral-900 text-white dark:bg-[#F5EFEB] dark:text-black px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-black dark:hover:bg-white transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-98"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4 text-white dark:text-black" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment & Order Review */}
          {step === 2 && (
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              
              {/* Payment Methods Selector */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Select Payment Method:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Online Automated Gateway (UddoktaPay) */}
                  <div
                    onClick={() => handleInputChange('paymentMethod', 'online')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all relative overflow-hidden ${
                      formData.paymentMethod === 'online'
                        ? 'border-[#C5A059] bg-amber-50/60 dark:bg-[#1E1E22] ring-2 ring-[#C5A059]/40 shadow-sm'
                        : 'border-neutral-200 bg-neutral-50 dark:border-[#27272A] dark:bg-[#141417] hover:border-neutral-400 dark:hover:border-neutral-500'
                    }`}
                  >
                    <div className="absolute top-2 right-2">
                      <span className="text-[9px] uppercase font-bold tracking-wider bg-[#C5A059] text-black px-1.5 py-0.5 rounded-md">
                        Auto
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">Pay Online</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">
                      bKash, Nagad, Rocket, Cards
                    </p>
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    onClick={() => handleInputChange('paymentMethod', 'cod')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      formData.paymentMethod === 'cod'
                        ? 'border-[#C5A059] bg-amber-50/50 dark:bg-[#1E1E22] ring-1 ring-[#C5A059]/30'
                        : 'border-neutral-200 bg-neutral-50 dark:border-[#27272A] dark:bg-[#141417] hover:border-neutral-400 dark:hover:border-neutral-500'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Banknote className="w-4 h-4 text-[#C5A059]" />
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">Cash on Delivery</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">
                      Pay cash upon delivery in BD
                    </p>
                  </div>

                  {/* Manual bKash */}
                  <div
                    onClick={() => handleInputChange('paymentMethod', 'bkash')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      formData.paymentMethod === 'bkash'
                        ? 'border-[#C5A059] bg-pink-50/50 dark:bg-[#1E1E22] ring-1 ring-[#C5A059]/30'
                        : 'border-neutral-200 bg-neutral-50 dark:border-[#27272A] dark:bg-[#141417] hover:border-neutral-400 dark:hover:border-neutral-500'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Smartphone className="w-4 h-4 text-pink-500" />
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">Manual bKash</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">
                      Send Money & enter TrxID
                    </p>
                  </div>

                </div>
              </div>

              {/* Online Gateway Info Banner when selected */}
              {formData.paymentMethod === 'online' && (
                <div className="p-4 bg-gradient-to-br from-amber-500/10 via-pink-500/5 to-blue-500/10 dark:from-[#18181B] dark:to-[#121214] border border-[#C5A059]/40 dark:border-[#C5A059]/30 rounded-2xl space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        UddoktaPay / Paymently Automated Gateway
                      </span>
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/20">
                      ✓ Instant Auto-Verify
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <div className="p-2 rounded-xl bg-white dark:bg-[#1E1E22] border border-neutral-200 dark:border-[#27272A] text-center">
                      <span className="text-xs font-bold text-pink-600 block">bKash</span>
                      <span className="text-[10px] text-neutral-400">Personal / App</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-[#1E1E22] border border-neutral-200 dark:border-[#27272A] text-center">
                      <span className="text-xs font-bold text-orange-600 block">Nagad</span>
                      <span className="text-[10px] text-neutral-400">Direct Gateway</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-[#1E1E22] border border-neutral-200 dark:border-[#27272A] text-center">
                      <span className="text-xs font-bold text-purple-600 block">Rocket / Upay</span>
                      <span className="text-[10px] text-neutral-400">Instant Pin</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-[#1E1E22] border border-neutral-200 dark:border-[#27272A] text-center">
                      <span className="text-xs font-bold text-blue-600 block">Visa / Master</span>
                      <span className="text-[10px] text-neutral-400">Cards & Bank</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-relaxed pt-1">
                    Clicking <strong>Pay Online Now</strong> will securely redirect you to the Paymently gateway to complete payment. Upon successful payment, your order will be automatically verified and confirmed.
                  </p>
                </div>
              )}

              {/* bKash / Nagad Instructions when selected */}
              {formData.paymentMethod === 'bkash' && (
                <div className="p-4 bg-neutral-50 dark:bg-[#09090B] border border-neutral-200 dark:border-[#27272A] rounded-2xl space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-[#C5A059]">
                      bKash / Nagad Merchant Instructions
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={copyMerchantNumber}
                        className="text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-[#1E1E22] border border-neutral-300 dark:border-[#27272A] px-2.5 py-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-[#27272A] transition-colors cursor-pointer"
                      >
                        {copiedNumber ? '✓ Copied Number' : '📋 Copy Number'}
                      </button>
                      <button
                        type="button"
                        onClick={fillSampleTrxId}
                        className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-[#1E1E22] border border-neutral-200 dark:border-[#27272A] px-2 py-1 rounded-lg hover:bg-neutral-200 cursor-pointer"
                      >
                        Sample TrxID
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-neutral-700 dark:text-neutral-300 space-y-1">
                    <p>1. Send <strong className="text-neutral-900 dark:text-white font-mono">{formatPrice(grandTotal)}</strong> to Merchant: <strong className="text-[#C5A059] font-mono">01712-894200</strong></p>
                    <p>2. Enter Reference: <strong className="text-neutral-900 dark:text-white">KBD</strong></p>
                    <p>3. Enter your Transaction ID (TrxID) below to verify instantly:</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                        Your bKash / Nagad Number
                      </label>
                      <input
                        type="tel"
                        inputMode="tel"
                        placeholder="017XXXXXXXX"
                        value={formData.bkashNumber}
                        onChange={(e) => handleInputChange('bkashNumber', e.target.value)}
                        className="w-full bg-white dark:bg-[#1E1E22] border border-neutral-300 dark:border-[#27272A] rounded-xl px-3 py-2.5 text-base sm:text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                        Transaction ID (TrxID) *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. BKL82937401"
                        value={formData.trxId}
                        onChange={(e) => handleInputChange('trxId', e.target.value.toUpperCase())}
                        className="w-full bg-white dark:bg-[#1E1E22] border border-neutral-300 dark:border-[#27272A] rounded-xl px-3 py-2.5 text-base sm:text-xs font-mono uppercase text-neutral-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Card Payment Fields */}
              {formData.paymentMethod === 'card' && (
                <div className="p-4 bg-neutral-50 dark:bg-[#09090B] border border-neutral-200 dark:border-[#27272A] rounded-2xl space-y-3 animate-in fade-in">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="4123 •••• •••• 9823"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      className="w-full bg-white dark:bg-[#1E1E22] border border-neutral-300 dark:border-[#27272A] rounded-xl px-3 py-2.5 text-base sm:text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        placeholder="08/28"
                        value={formData.cardExpiry}
                        onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                        className="w-full bg-white dark:bg-[#1E1E22] border border-neutral-300 dark:border-[#27272A] rounded-xl px-3 py-2.5 text-base sm:text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="•••"
                        value={formData.cardCvv}
                        onChange={(e) => handleInputChange('cardCvv', e.target.value)}
                        className="w-full bg-white dark:bg-[#1E1E22] border border-neutral-300 dark:border-[#27272A] rounded-xl px-3 py-2.5 text-base sm:text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary Recap */}
              <div className="bg-neutral-50 dark:bg-[#09090B] p-4 rounded-2xl border border-neutral-200 dark:border-[#27272A] space-y-2 text-xs">
                <div className="font-semibold text-neutral-900 dark:text-white mb-1 uppercase tracking-wider text-[11px] font-mono">Order Summary</div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Recipient:</span>
                  <span className="font-medium text-neutral-900 dark:text-neutral-200">
                    {formData.fullName} ({formData.phone})
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Ship To:</span>
                  <span className="font-medium text-neutral-900 dark:text-neutral-200 text-right max-w-xs truncate">
                    {formData.cityArea}, {formData.division}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Items:</span>
                  <span className="text-neutral-900 dark:text-neutral-200">{cart.length} item(s)</span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Delivery:</span>
                  <span className="text-neutral-900 dark:text-neutral-200 font-mono">{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-neutral-900 dark:text-white pt-2 border-t border-neutral-200 dark:border-[#27272A]">
                  <span className="uppercase tracking-wider text-xs">Total Amount:</span>
                  <span className="font-mono text-base text-neutral-900 dark:text-[#F5EFEB]">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Action Buttons & Fallback */}
              <div className="space-y-2.5 pt-1 pb-[env(safe-area-inset-bottom,0px)]">
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={isSubmitting}
                    className="px-5 py-3.5 rounded-full border border-neutral-300 dark:border-[#27272A] text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:border-neutral-400 transition-colors cursor-pointer"
                  >
                    ← Back
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-neutral-900 text-white hover:bg-black dark:bg-[#F5EFEB] dark:text-black dark:hover:bg-white py-3.5 px-6 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" />
                        <span>{formData.paymentMethod === 'online' ? 'Connecting Gateway...' : 'Confirming Order...'}</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {formData.paymentMethod === 'online'
                            ? `Pay Online Now (${formatPrice(grandTotal)})`
                            : `Place Order (${formatPrice(grandTotal)})`}
                        </span>
                        <ArrowRight className="w-4 h-4 text-white dark:text-black" />
                      </>
                    )}
                  </button>
                </div>

                {/* Direct WhatsApp confirmation option */}
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full py-2.5 rounded-full border border-emerald-500/40 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
                >
                  <span>💬 Or Confirm via WhatsApp</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
};
