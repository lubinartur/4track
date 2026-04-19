'use client';

import ItemMetaRow from '@/components/item/ItemMetaRow';
import {
  movieActionFocusRing,
  movieActionPress,
  movieActionTransition,
} from '@/lib/movieActionAppearance';

function SparklesIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable="false"
    >
      <path d="M9 3l1.7 4.6L15 9l-4.3 1.4L9 15l-1.7-4.6L3 9l4.3-1.4L9 3z" />
      <path d="M19 5l.9 2.4L22 8l-2.1.6L19 11l-.9-2.4L16 8l2.1-.6L19 5z" />
      <path d="M19 13l1.1 3L23 17l-2.9 1-1.1 3-1.1-3L15 17l2.9-1 1.1-3z" />
    </svg>
  );
}

function HeartIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable="false"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

function EyeOffIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable="false"
    >
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a18.16 18.16 0 0 1-4.28 5.18" />
      <path d="M6.61 6.61A18.15 18.15 0 0 0 2 12s3 7 10 7a10.6 10.6 0 0 0 5.39-1.46" />
      <path d="M14.12 14.12a3 3 0 0 1-4.24-4.24" />
      <path d="M1 1l22 22" />
    </svg>
  );
}

type OnboardingHeroPreviewCardProps = {
  title: string;
  posterUrl: string;
  rating: string;
  year: number;
  genresLabel: string;
  aiMatchPercent: number;
  reasonTags: [string, string, string];
  /** When provided, shows 2-button rating row (MovieRate screen). */
  mode?: 'welcome' | 'rate';
  onLike?: () => void;
  onNotSeen?: () => void;
};

const chip =
  'flex h-8 shrink-0 items-center justify-center rounded-[17px] bg-[rgba(255,255,255,0.1)] px-4 pb-[9px] pt-2 text-center text-[12px] font-normal whitespace-nowrap text-[rgba(255,255,255,0.4)]';

const iconBtn = [
  'flex h-10 w-[57px] shrink-0 items-center justify-center rounded-xl border border-[#ff5b00] bg-[#101018] text-white',
  movieActionTransition,
  movieActionPress,
  'hover:opacity-95',
  movieActionFocusRing,
].join(' ');

export default function OnboardingHeroPreviewCard({
  title,
  posterUrl,
  rating,
  year,
  genresLabel,
  aiMatchPercent,
  reasonTags,
  mode = 'welcome',
  onLike,
  onNotSeen,
}: OnboardingHeroPreviewCardProps) {
  const [t1, t2, t3] = reasonTags;

  return (
    <article className="relative w-[326px] shrink-0">
      <div className="relative h-[470px] w-full overflow-hidden rounded-[20px] shadow-[0px_10px_28px_0px_rgba(0,0,0,0.42)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={posterUrl} alt="" className="absolute inset-0 z-0 size-full object-cover" />

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 top-[28%] z-[1] rounded-b-[20px] bg-[linear-gradient(180deg,transparent_0%,rgba(8,8,14,0.25)_38%,rgba(12,12,20,0.72)_58%,rgba(14,14,22,0.92)_78%,#101018_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] z-[1] rounded-b-[20px] bg-gradient-to-t from-[#101018] from-[18%] via-[#101018]/92 via-[45%] to-transparent"
          aria-hidden
        />

        <div className="pointer-events-none [&_*]:pointer-events-none absolute left-1/2 top-6 z-[3] flex -translate-x-1/2 justify-center">
          <div className="flex items-center gap-1.5 rounded-[20px] border border-[#ff5b00]/35 bg-[#101018] px-3 py-1.5">
            <SparklesIcon size={14} className="shrink-0 text-[#ff5b00]" />
            <span className="whitespace-nowrap text-center text-[12px] font-normal text-[#ff5b00]">
              AI MATCH {aiMatchPercent}%
            </span>
          </div>
        </div>

        <div className="pointer-events-none [&_*]:pointer-events-none absolute inset-x-0 bottom-0 top-[38.17%] z-[3] flex flex-col justify-end pb-[78px]">
          <div className="flex flex-col items-center gap-2 px-3">
            <h2 className="text-center text-[32px] font-bold leading-none tracking-normal text-white">
              {title}
            </h2>
            <ItemMetaRow rating={rating} year={year} genresLabel={genresLabel} className="justify-center" />
            <div className="mt-1 flex min-w-0 w-full flex-nowrap justify-center gap-2 overflow-x-auto scrollbar-hide">
              <span className={chip}>{t1}</span>
              <span className={chip}>{t2}</span>
              <span className={chip}>{t3}</span>
            </div>
          </div>
        </div>

        {mode === 'rate' ? (
          <div className="pointer-events-auto absolute bottom-[18px] left-1/2 z-[4] mt-5 flex -translate-x-1/2 gap-[13px]">
            <button type="button" className={iconBtn} onClick={onLike} aria-label="Like">
              <HeartIcon size={16} />
            </button>
            <button type="button" className={iconBtn} onClick={onNotSeen} aria-label="Not seen">
              <EyeOffIcon size={16} />
            </button>
          </div>
        ) : (
          <div className="pointer-events-auto absolute bottom-[18px] left-1/2 z-[4] mt-5 flex -translate-x-1/2 gap-[13px]">
            {/* Welcome preview: static buttons (non-interactive) */}
            <div className={iconBtn} aria-hidden />
            <div className={iconBtn} aria-hidden />
            <div className={iconBtn} aria-hidden />
          </div>
        )}
      </div>
    </article>
  );
}

