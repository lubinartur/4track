'use client';

import type { TabItem } from '@/types/tabs';

export type { TabItem };

type TabsProps = {
  items: TabItem[];
  activeItem: string;
  onChange?: (id: string) => void;
};

/** Category pills — Figma “TabsRow” (88:331): 8px gap, 36px height, 16px horizontal padding, #ff5b00 brand. */
export default function Tabs({ items, activeItem, onChange }: TabsProps) {
  return (
    <div
      className="flex w-full min-w-0 flex-nowrap items-center gap-2 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label="Content categories"
    >
      {items.map((item) => {
        const selected = item.id === activeItem;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange?.(item.id)}
            className={
              selected
                ? 'flex h-9 shrink-0 items-center justify-center rounded-[16px] bg-[#ff5b00] px-4 pb-[9px] pt-2 text-center text-[12px] font-normal leading-none text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5b00]/45'
                : 'flex h-9 shrink-0 items-center justify-center rounded-[17px] border border-solid border-[#ff5b00] bg-[rgba(16,16,24,0.16)] px-4 pb-[9px] pt-2 text-center text-[12px] font-normal leading-none text-white transition-colors hover:bg-[rgba(16,16,24,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5b00]/35'
            }
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
