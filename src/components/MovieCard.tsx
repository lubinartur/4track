import Link from 'next/link';
import type { MovieItem } from '@/types/movie';

export type MovieCardProps = MovieItem;

export default function MovieCard({ title, posterUrl, itemSlug }: MovieCardProps) {
  const posterShellInteractive =
    'transition-[filter,box-shadow] duration-[170ms] ease-out group-hover:brightness-[1.04] group-focus-visible:brightness-[1.04] group-hover:shadow-[0_6px_24px_rgba(0,0,0,0.45)] group-focus-visible:shadow-[0_6px_24px_rgba(0,0,0,0.45)]';

  const posterInner = (
    <div
      className={[
        'relative z-[1] h-[180px] w-[120px] overflow-hidden rounded-[20px]',
        'bg-gradient-to-br from-[#1c1c26] via-[#0f0f14] to-[#08080c]',
        'shadow-[0px_8px_20px_0px_rgba(0,0,0,0.35)]',
        itemSlug && posterShellInteractive,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {posterUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- until `next/image` domains are configured
        <img src={posterUrl} alt={title} className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full bg-[radial-gradient(ellipse_72%_58%_at_50%_42%,rgba(255,255,255,0.055),transparent_68%)]" aria-hidden />
      )}
    </div>
  );

  if (itemSlug) {
    return (
      <Link
        href={`/item/${itemSlug}`}
        className="group block w-[120px] shrink-0 rounded-[20px] transition-transform duration-[170ms] ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5b00]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e111a]"
      >
        <div className="relative h-[180px] w-[120px]">
          <div
            className="pointer-events-none absolute left-1/2 top-[52%] z-0 h-[210px] w-[152px] -translate-x-1/2 -translate-y-1/2 opacity-0 blur-[52px] transition-opacity duration-200 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
            style={{
              background:
                'radial-gradient(circle at 50% 48%, rgba(255,91,0,0.2) 0%, rgba(255,91,0,0.06) 42%, transparent 72%)',
            }}
            aria-hidden
          />
          {posterInner}
        </div>
      </Link>
    );
  }

  return <article className="w-[120px] shrink-0">{posterInner}</article>;
}
