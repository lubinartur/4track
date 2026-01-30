'use client';

import { useUIStore } from '@/store/ui.store';

export default function ReflectiveCard() {
  const openChat = useUIStore((state) => state.openChat);

  return (
    <div className="rounded-[28px] border border-white/5 bg-[#141420]/60 p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
      <div className="mb-5 flex items-center gap-2">
        <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-tertiary">
          REFLECTIVE INTELLIGENCE
        </div>
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="none"
          className="text-[#ff3d00]/50"
        >
          <path
            d="M6 1L7.5 4.5L11 6L7.5 7.5L6 11L4.5 7.5L1 6L4.5 4.5L6 1Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <p
        className="mb-7 text-[18px] leading-[1.7] text-primary"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic', fontWeight: 400 }}
      >
        &ldquo;Based on your recent activity, tonight feels like a good moment for something intense but not exhausting.&rdquo;
      </p>
      <button
        onClick={() => openChat('Life')}
        className="relative w-full rounded-[20px] bg-[#0f0f14] px-4 py-3.5 text-[14px] font-medium text-primary shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] transition-all hover:bg-[#121218] hover:shadow-[0_3px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] active:scale-[0.98]"
      >
        Ask your Curator
      </button>
    </div>
  );
}
