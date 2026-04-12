/** Figma HeroMovieCard (101:1376): single composite card — poster, overlay, AI badge, meta, tags, actions. */
export type HomeHeroContent = {
  id: string;
  title: string;
  posterUrl: string;
  rating: string;
  year: number;
  /** e.g. "Sci-Fi / Action" — shown in meta row */
  genresLabel: string;
  aiMatchPercent: number;
  reasonTags: readonly [string, string, string];
  tasteInsight: {
    entryCount: number;
    description: string;
  };
  itemSlug?: string;
};
