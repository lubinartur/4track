import type { ItemCredits } from '@/types/item';

type ItemCreditsGridProps = {
  credits: ItemCredits;
};

export default function ItemCreditsGrid({ credits }: ItemCreditsGridProps) {
  const cells = [
    { label: 'Director', value: credits.director },
    { label: 'Lead', value: credits.lead },
    { label: 'Music', value: credits.music },
    { label: 'Studio', value: credits.studio },
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6">
      {cells.map(({ label, value }) => (
        <div key={label} className="min-w-0">
          <p className="text-[12px] font-normal uppercase leading-none tracking-[1.2px] text-[rgba(255,255,255,0.5)]">
            {label}
          </p>
          <p className="mt-2 text-[14px] font-normal leading-5 text-white">{value}</p>
        </div>
      ))}
    </div>
  );
}
