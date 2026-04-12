const p = (file: string) => `https://image.tmdb.org/t/p/w500/${file}`;

export type HeroMovie = {
  title: string;
  posterUrl: string;
  aiMatchPercent: number;
  rating: string;
  year: number;
  genresLabel: string;
  reasonTags: string[];
};

export type RecommendedPoster = {
  id: string;
  title: string;
  posterUrl: string;
};

export const mockHeroMovie: HeroMovie = {
  title: 'Inception',
  posterUrl: p('oYuLEt3zVCKq57qu2F8dT3NI6kr.jpg'),
  aiMatchPercent: 90,
  rating: '8.6',
  year: 2010,
  genresLabel: 'Sci-Fi / Action',
  reasonTags: ['Atmospheric', 'Epic', 'Dark'],
};

/** Poster URLs match TMDB CDN paths used on the web app (verified loadable). */
export const mockRecommended: RecommendedPoster[] = [
  { id: 'r1', title: 'Past Lives', posterUrl: p('k3waqVXSnvCZWfJYNtdamTgTtTA.jpg') },
  { id: 'r2', title: 'Aftersun', posterUrl: p('evKz85EKouVbIr51zy5fOtpNRPg.jpg') },
  { id: 'r3', title: 'Portrait of a Lady on Fire', posterUrl: p('2LquGwEhbg3soxSCs9VNyh5VJd9.jpg') },
];

export const mockTasteInsight = {
  headline: 'Matches your taste for psychological sci-fi.',
  similarLine: 'Similar to movies you rated highly:',
  similarTitles: 'Interstellar • Blade Runner 2049',
};
