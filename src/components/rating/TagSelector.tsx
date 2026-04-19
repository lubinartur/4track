'use client';

type TagSelectorProps = {
  options: readonly string[];
  selected: string[];
  maxSelected?: number;
  onToggle: (tag: string) => void;
};

/**
 * Multi-select chips; at `maxSelected`, unselected tags are disabled until one is cleared.
 */
export default function TagSelector({
  options,
  selected,
  maxSelected = 3,
  onToggle,
}: TagSelectorProps) {
  const selectedSet = new Set(selected);
  const atCap = selected.length >= maxSelected;

  return (
    <div className="flex w-full max-w-[358px] flex-wrap content-start gap-x-2 gap-y-3">
      {options.map((tag) => {
        const isOn = selectedSet.has(tag);
        const disabled = !isOn && atCap;
        return (
          <button
            key={tag}
            type="button"
            disabled={disabled}
            onClick={() => onToggle(tag)}
            aria-pressed={isOn}
            className={[
              'flex h-8 shrink-0 items-center justify-center rounded-2xl px-4 pb-[9px] pt-2 text-[12px] font-normal leading-none text-white transition-opacity',
              isOn
                ? 'bg-[#ff5b00] hover:opacity-95'
                : 'border border-solid border-[#ff5b00] bg-[rgba(16,16,24,0.16)] hover:opacity-95',
              disabled ? 'cursor-not-allowed opacity-35' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
