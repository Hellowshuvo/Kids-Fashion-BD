import React, { useState } from 'react';
import { X, Send, Phone, Clock } from 'lucide-react';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Welcome to Kids Fashion BD Concierge. How may we assist your bespoke order or sizing today?',
      time: 'Just now',
    },
  ]);
  const [inputVal, setInputVal] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal;
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, time: 'Just now' },
    ]);
    setInputVal('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Thank you! For priority concierge or instant styling assistance in Narayanganj & Dhaka, connect directly with our studio at +880 1712-894200.',
          time: 'Just now',
        },
      ]);
    }, 800);
  };

  return (
    <div className="fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-40">
      {/* Pop-up Chat Window */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-1.5rem)] sm:w-96 max-w-sm bg-white dark:bg-[#141417] text-neutral-900 dark:text-white rounded-2xl shadow-2xl border border-neutral-200 dark:border-[#27272A] overflow-hidden animate-in zoom-in-95 duration-200 text-left">
          
          {/* Top header */}
          <div className="bg-neutral-900 text-white dark:bg-[#09090B] p-3.5 sm:p-4 flex items-center justify-between border-b border-neutral-800 dark:border-[#27272A]">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-neutral-800 dark:bg-[#1E1E22] border border-[#C5A059]/40 flex items-center justify-center text-xs font-serif font-bold text-[#C5A059]">
                  KB
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#C5A059] ring-2 ring-neutral-900 dark:ring-[#09090B]" />
              </div>
              <div>
                <h4 className="text-xs font-bold tracking-wider uppercase text-white">Kids Fashion BD Atelier</h4>
                <p className="text-[10px] text-neutral-400">Personal Stylist Online</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-800 dark:hover:bg-[#27272A] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick info banner with WhatsApp & Call */}
          <div className="bg-neutral-100 dark:bg-[#1E1E22] px-3.5 py-2 border-b border-neutral-200 dark:border-[#27272A] flex items-center justify-between text-[11px] text-neutral-700 dark:text-neutral-300">
            <span className="flex items-center gap-1.5 font-medium truncate">
              <Clock className="w-3 h-3 text-[#C5A059] shrink-0" />
              <span className="truncate">Narayanganj 10AM-8PM</span>
            </span>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="https://wa.me/8801712894200"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1"
              >
                <span>WhatsApp</span>
              </a>
              <a
                href="tel:+8801712894200"
                className="text-[#C5A059] hover:underline flex items-center gap-1 font-semibold"
              >
                <Phone className="w-2.5 h-2.5" />
                <span>Call</span>
              </a>
            </div>
          </div>

          {/* Messages list */}
          <div className="p-4 h-64 overflow-y-auto space-y-3 bg-neutral-50 dark:bg-[#141417] text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-neutral-900 text-white dark:bg-[#F5EFEB] dark:text-black rounded-br-none font-medium'
                      : 'bg-white dark:bg-[#1E1E22] border border-neutral-200 dark:border-[#27272A] text-neutral-800 dark:text-neutral-200 shadow-xs rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-neutral-400 dark:text-neutral-500 mt-1 px-1">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 pb-2 pt-1 flex items-center gap-1.5 overflow-x-auto bg-neutral-100 dark:bg-[#09090B] border-t border-neutral-200 dark:border-[#27272A]">
            <button
              onClick={() => setInputVal('What is the delivery time?')}
              className="text-[10px] whitespace-nowrap bg-white dark:bg-[#1E1E22] border border-neutral-200 dark:border-[#27272A] hover:border-[#C5A059] px-2.5 py-1 rounded-full text-neutral-700 dark:text-neutral-300 cursor-pointer transition-colors shadow-xs"
            >
              Delivery time in Narayanganj?
            </button>
            <button
              onClick={() => setInputVal('Do you have Cash on Delivery?')}
              className="text-[10px] whitespace-nowrap bg-white dark:bg-[#1E1E22] border border-neutral-200 dark:border-[#27272A] hover:border-[#C5A059] px-2.5 py-1 rounded-full text-neutral-700 dark:text-neutral-300 cursor-pointer transition-colors shadow-xs"
            >
              Cash on Delivery?
            </button>
          </div>

          {/* Input field */}
          <form onSubmit={handleSend} className="p-3 border-t border-neutral-200 dark:border-[#27272A] bg-white dark:bg-[#09090B] flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 text-base sm:text-xs bg-neutral-100 dark:bg-[#1E1E22] border border-neutral-200 dark:border-[#27272A] rounded-xl px-3 py-2 text-neutral-900 dark:text-white outline-none focus:border-[#C5A059] transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
            />
            <button
              type="submit"
              className="p-2 bg-neutral-900 text-white dark:bg-[#F5EFEB] dark:text-black rounded-xl hover:bg-black dark:hover:bg-white transition-colors flex-shrink-0 cursor-pointer font-bold"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}

      {/* The Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open support chat"
        className="w-13 h-13 rounded-full bg-white dark:bg-[#141417] text-neutral-900 dark:text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-neutral-200 dark:border-[#27272A] hover:border-[#C5A059]"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <svg
            className="w-6 h-6 fill-current text-neutral-900 dark:text-[#F5EFEB]"
            viewBox="0 0 24 24"
          >
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        )}
      </button>
    </div>
  );
};
