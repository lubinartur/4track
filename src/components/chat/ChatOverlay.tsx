'use client';

import { useUIStore } from '@/store/ui.store';
import { useState } from 'react';

export default function ChatOverlay() {
  const { isChatOpen, chatContext, closeChat } = useUIStore();
  const [inputValue, setInputValue] = useState('');

  if (!isChatOpen) return null;

  const suggestionChips = ['Reflect', 'Recommend', 'Summarize', 'Why it worked'];

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={closeChat}
        aria-hidden="true"
      />
      <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] rounded-t-[36px] border-t border-white/5 bg-[#141420]/80 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4.5">
          <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/35">
            Talking about: {chatContext}
          </div>
          <button
            onClick={closeChat}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/5 bg-white/[0.03] text-white/50 transition-colors hover:bg-white/8 hover:text-white/70"
            aria-label="Close chat"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              className="text-current"
            >
              <path
                d="M5 5L15 15M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(85vh-120px)] min-h-[400px]">
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {/* Empty state insight */}
            <div className="mb-8 max-w-[90%]">
              <p
                className="text-[17px] leading-[1.58] text-white/90"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic', fontWeight: 400 }}
              >
                &ldquo;What would you like to explore about {chatContext}? I can help you reflect, find recommendations, or summarize your journey.&rdquo;
              </p>
            </div>

            {/* Suggestion chips - horizontal scroll */}
            <div className="flex overflow-x-auto gap-2 pb-2 -mx-2 px-2 scrollbar-hide">
              {suggestionChips.map((chip) => (
                <button
                  key={chip}
                  className="flex-shrink-0 rounded-full border border-white/5 bg-white/[0.04] px-3.5 py-2 text-[12px] font-medium text-primary transition-colors hover:bg-white/[0.08] hover:border-white/8"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Input (secondary) */}
          <div className="border-t border-white/5 px-6 py-4" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your question..."
              className="w-full rounded-xl bg-white/[0.03] px-4 py-2.5 text-[14px] text-primary placeholder:text-white/25 focus:outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] transition-colors"
            />
          </div>
        </div>
      </div>
    </>
  );
}
