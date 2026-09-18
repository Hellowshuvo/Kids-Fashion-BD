import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Send, Phone, Mail, MapPin, CheckCircle2, MessageSquare, Loader2 } from 'lucide-react';

export const ContactModal = () => {
  const { isContactOpen, setIsContactOpen, showToast, theme } = useStore();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isContactOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      showToast('Name and message are required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.status) {
        setIsSubmitted(true);
        showToast('Your message has been sent to our studio!', 'success');
        setTimeout(() => {
          setIsSubmitted(false);
          setIsContactOpen(false);
          setFormData({ name: '', phone: '', email: '', subject: 'General Inquiry', message: '' });
        }, 2200);
      } else {
        showToast(data.message || 'Could not send inquiry', 'error');
      }
    } catch (err) {
      showToast('Connection error. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={() => setIsContactOpen(false)} />

      <div className={`relative w-full max-w-xl rounded-3xl border shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto text-left transition-colors duration-200 ${
        isDark ? 'bg-[#141417] border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
      }`}>
        <button
          onClick={() => setIsContactOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-[#C5A059]" />
          </div>
          <span className="text-[11px] uppercase tracking-widest font-bold text-[#C5A059] font-mono">
            Kids Fashion BD Atelier
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-1 font-serif">
          Contact Studio & Sizing Support
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
          Have a question about fabric, measurements, custom Eid sets, or wholesale? Drop us a line below.
        </p>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3 bg-neutral-50 dark:bg-[#09090B] rounded-2xl border border-neutral-200 dark:border-neutral-800 animate-in zoom-in-95">
            <CheckCircle2 className="w-12 h-12 text-[#C5A059] mx-auto" />
            <h4 className="text-base font-bold text-neutral-900 dark:text-white">Inquiry Received!</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Our team at Katherpool Shibu Market, Narayanganj will review your request and get in touch via phone or email shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shuvo Ahmed"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-[#09090B] border border-neutral-300 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="01842533335"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-[#09090B] border border-neutral-300 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-[#09090B] border border-neutral-300 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
                  Inquiry Topic
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-[#09090B] border border-neutral-300 dark:border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Size & Sizing Recommendation">Size & Sizing Guide</option>
                  <option value="Bespoke / Custom Tailoring">Bespoke / Custom Tailoring</option>
                  <option value="Order Exchange / Return">Order Exchange / Return</option>
                  <option value="Wholesale / Bulk Inquiry">Wholesale / Bulk Inquiry</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
                Your Message *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Tell us how we can help you..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-neutral-50 dark:bg-[#09090B] border border-neutral-300 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-neutral-900 text-white dark:bg-[#F5EFEB] dark:text-black py-3 rounded-full text-xs uppercase tracking-wider font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Inquiry...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message to Studio</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
            <a href="tel:+8801842533335" className="hover:underline">+880 1842-533335</a>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
            <a href="mailto:Kidsfashionbd.store@gmail.com" className="hover:underline truncate">Kidsfashionbd.store@gmail.com</a>
          </div>
        </div>
      </div>
    </div>
  );
};
