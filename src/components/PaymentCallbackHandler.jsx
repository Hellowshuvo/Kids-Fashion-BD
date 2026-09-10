import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import confetti from 'canvas-confetti';
import { Loader2 } from 'lucide-react';

export const PaymentCallbackHandler = () => {
  const { setLastOrder, clearCart, showToast } = useStore();
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const invoiceId = urlParams.get('invoice_id');
    const paymentStatus = urlParams.get('payment_status');

    if (paymentStatus === 'cancel') {
      showToast('Online payment was cancelled. Your bag items have been retained.', 'info');
      cleanUrlParams();
      return;
    }

    if (!invoiceId) return;

    // Verify invoice with secure backend
    const verifyTransaction = async () => {
      setIsVerifying(true);
      showToast('Verifying payment with UddoktaPay gateway...', 'info');

      try {
        const response = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invoice_id: invoiceId }),
        });

        const resData = await response.json();
        const data = resData.data || resData;

        if (data.status === 'COMPLETED' || data.status === true) {
          // Trigger celebration confetti
          try {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch (e) {}

          // Retrieve saved pending order from localStorage
          let finalOrder = null;
          try {
            const savedPending = localStorage.getItem('kfb_pending_order');
            if (savedPending) {
              finalOrder = JSON.parse(savedPending);
            }
          } catch (e) {}

          const completedOrder = {
            orderId: finalOrder?.orderId || ('KB-' + (data.invoice_id?.slice(-6) || Math.floor(100000 + Math.random() * 900000))),
            date: finalOrder?.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            customer: {
              name: data.full_name || finalOrder?.customer?.name || 'Valued Customer',
              phone: data.sender_number || finalOrder?.customer?.phone || 'N/A',
              email: data.email || finalOrder?.customer?.email || 'N/A',
              division: finalOrder?.customer?.division || 'Dhaka',
              cityArea: finalOrder?.customer?.cityArea || 'City',
              address: finalOrder?.customer?.address || 'Delivery Address',
              notes: finalOrder?.customer?.notes || '',
            },
            payment: {
              method: `UddoktaPay Online (${(data.payment_method || 'MFS/Card').toUpperCase()})`,
              status: 'Paid Online (Verified)',
              trxId: data.transaction_id || invoiceId,
              invoiceId: data.invoice_id || invoiceId,
              paymentMethod: data.payment_method || 'bkash',
              senderNumber: data.sender_number || null,
              chargedAmount: data.charged_amount || data.amount,
            },
            items: finalOrder?.items || [],
            subtotal: finalOrder?.subtotal || parseFloat(data.amount || 0),
            discount: finalOrder?.discount || 0,
            promoCode: finalOrder?.promoCode || null,
            shipping: finalOrder?.shipping || 0,
            total: parseFloat(data.charged_amount || data.amount) || finalOrder?.total || (finalOrder?.subtotal ? finalOrder.subtotal + (finalOrder.shipping || 0) : 0),
            estimatedDelivery: finalOrder?.estimatedDelivery || 'Within 24 to 48 Hours',
          };

          setLastOrder(completedOrder);
          clearCart();
          localStorage.removeItem('kfb_pending_order');
          showToast('Payment verified successfully! Thank you for your order.', 'success');
        } else if (data.status === 'PENDING') {
          showToast('Payment received and is currently pending verification.', 'info');
        } else {
          showToast(data.message || 'Payment verification was not successful.', 'error');
        }
      } catch (err) {
        showToast('Unable to connect to payment verification server.', 'error');
      } finally {
        setIsVerifying(false);
        cleanUrlParams();
      }
    };

    verifyTransaction();
  }, []);

  const cleanUrlParams = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('invoice_id');
      url.searchParams.delete('payment_status');
      window.history.replaceState({}, document.title, url.pathname);
    } catch (e) {}
  };

  if (!isVerifying) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#141417] text-neutral-900 dark:text-white p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center border border-neutral-200 dark:border-[#27272A]">
        <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin mx-auto mb-3" />
        <h3 className="text-sm font-bold uppercase tracking-wider mb-1">Verifying Payment</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Communicating with UddoktaPay gateway. Please hold on...
        </p>
      </div>
    </div>
  );
};
