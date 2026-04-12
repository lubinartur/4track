type ItemBackdropProps = {
  /** Poster artwork — sole hero background source (Netflix-style blurred plate). */
  posterUrl: string;
  alt?: string;
};

/** Matches Figma ambient base (#161620) — hero fades into this, no seam. */
const PAGE_BG = '#161620';

/** TMDB poster at higher width so the blurred layer keeps recognizable shapes. */
function tmdbHeroSourceUrl(url: string): string {
  if (url.includes('image.tmdb.org') && url.includes('/t/p/w500/')) {
    return url.replace('/t/p/w500/', '/t/p/w1280/');
  }
  if (url.includes('image.tmdb.org') && url.includes('/t/p/w780/')) {
    return url.replace('/t/p/w780/', '/t/p/w1280/');
  }
  return url;
}

/** Cinematic darkening — a touch heavier in upper/mid; eases before merge layer; no crush. */
const CINEMATIC_GRADIENT =
  'linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.35) 22%, rgba(0,0,0,0.38) 42%, rgba(0,0,0,0.41) 58%, rgba(0,0,0,0.44) 74%)';

/** Long vertical blend into the app background — no hard hero block edge. */
const PAGE_MERGE_GRADIENT = `linear-gradient(180deg, transparent 0%, transparent 28%, rgba(22,22,32,0.12) 42%, rgba(22,22,32,0.38) 58%, rgba(22,22,32,0.72) 74%, rgba(22,22,32,0.94) 88%, ${PAGE_BG} 100%)`;

/**
 * Cinematic blurred plate: poster scaled/cropped past the hero frame (slightly off-center crop),
 * lighter blur, soft dissolve into page background.
 */
export default function ItemBackdrop({ posterUrl, alt = '' }: ItemBackdropProps) {
  const src = tmdbHeroSourceUrl(posterUrl);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[420px] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element -- TMDB until next/image config */}
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full origin-[52%_36%] scale-[1.92] object-cover object-[52%_36%] blur-[18px] brightness-[0.8] saturate-[0.85] contrast-[1.05]"
        />
      </div>

      <div className="absolute inset-0" style={{ background: CINEMATIC_GRADIENT }} aria-hidden />
      <div className="absolute inset-0" style={{ background: PAGE_MERGE_GRADIENT }} aria-hidden />
    </div>
  );
}
