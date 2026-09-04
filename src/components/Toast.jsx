import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toast, closeToast } = useStore();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <aside
      aria-label="Notification"
      onClick={closeToast}
      className="fixed bottom-6 right-6 z-50 max-w-sm w-auto bg-neutral-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/10 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 cursor-pointer hover:bg-black"
    >
      {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
      {isError && <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />}
      {!isSuccess && !isError && <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />}

      <p className="text-xs sm:text-sm font-medium flex-1 text-white/95 pr-1">{toast.message}</p>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          closeToast();
        }}
        aria-label="Close notification"
        className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors ml-auto flex-shrink-0 cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </aside>
  );
};
