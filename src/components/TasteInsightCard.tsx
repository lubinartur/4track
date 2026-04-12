import Link from 'next/link';

type TasteInsightCardProps = {
  description: string;
  /** Optional; when set, eyebrow reads “Taste insight – based on {n} entries” with orange count (same styles as default eyebrow). */
  entryCount?: number;
};

export default function TasteInsightCard({ description, entryCount }: TasteInsightCardProps) {
  return (
    <section className="w-full max-w-[358px] rounded-[20px] border border-[rgba(255,91,0,0.35)] bg-[#101018] shadow-[0_12px_38px_-18px_rgba(0,0,0,0.52),0_0_32px_-14px_rgba(255,91,0,0.11)] p-4">
      <div className="flex flex-col gap-[12px]">
        <p className="text-[12px] font-normal leading-none tracking-[1.2px] text-[rgba(255,255,255,0.5)]">
          {entryCount != null ? (
            <>
              TASTE INSIGHT — BASED ON <span className="text-[#ff5b00]">{entryCount}</span> ENTRIES
            </>
          ) : (
            'TASTE INSIGHT'
          )}
        </p>
        <p className="text-[20px] font-normal leading-[normal] text-white">{description}</p>
        <Link
          href="/profile"
          className="inline-flex w-fit items-center gap-1.5 text-[12px] font-normal leading-none text-[#ff5b00] transition-colors hover:text-[#ff7a33]"
        >
          Explore taste
          <span aria-hidden className="translate-y-px">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
