'use client';

type GenreCardProps = {
  label: string;
  imageUrl: string;
  selected: boolean;
  disabled?: boolean;
  onToggle: () => void;
};

export default function GenreCard({ label, imageUrl, selected, disabled, onToggle }: GenreCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className={[
        'relative h-[96px] w-[173px] overflow-hidden rounded-[20px] text-white',
        'shadow-[0px_10px_24px_0px_rgba(0,0,0,0.22)]',
        'transition-[transform,opacity] duration-[170ms] ease-out',
        'enabled:active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5b00]/45',
        disabled ? 'opacity-40' : 'hover:opacity-95',
      ].join(' ')}
      aria-pressed={selected}
      aria-label={selected ? `${label} selected` : `Select ${label}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div
        className={[
          'absolute inset-0 rounded-[20px]',
          selected ? 'border-2 border-[#ff5b00]' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          backgroundImage:
            'linear-gradient(0.326deg, rgb(0,0,0) 0.55468%, rgba(0,0,0,0) 45.683%)',
        }}
        aria-hidden
      />
      <span className="absolute inset-0 flex items-center justify-center text-center text-[20px] font-medium leading-normal">
        {label}
      </span>
    </button>
  );
}

