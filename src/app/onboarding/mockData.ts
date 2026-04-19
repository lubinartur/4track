/** Shared mock data for onboarding flow (matches Figma content). */

const p = (file: string) => `https://image.tmdb.org/t/p/w780/${file}`;

export type OnboardingGenreOption = {
  id: string;
  label: string;
  imageUrl: string;
};

export const onboardingGenres: OnboardingGenreOption[] = [
  { id: 'thriller', label: 'Thriller', imageUrl: p('b9cZgtzcG2QbttylSWMJCdHU0NK.jpg') },
  { id: 'sci-fi', label: 'Sci-Fi', imageUrl: p('3bhkrj58Vtu7enYsRolD1fJpdPy.jpg') },
  { id: 'mystery', label: 'Mystery', imageUrl: p('cAoAgzOCxSytYBqqCQulhXNR3LB.jpg') },
  { id: 'crime', label: 'Crime', imageUrl: p('pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg') },
  { id: 'horror', label: 'Horror', imageUrl: p('evKz85EKouVbIr51zy5fOtpNRPg.jpg') },
  { id: 'action', label: 'Action', imageUrl: p('7IiTTgloJzvGI1TAYymCfbfl3vT.jpg') },
  { id: 'drama', label: 'Drama', imageUrl: p('k3waqVXSnvCZWfJYNtdamTgTtTA.jpg') },
  { id: 'fantasy', label: 'Fantasy', imageUrl: p('2LquGwEhbg3soxSCs9VNyh5VJd9.jpg') },
  { id: 'comedy', label: 'Comedy', imageUrl: p('b9cZgtzcG2QbttylSWMJCdHU0NK.jpg') },
];

export type OnboardingMovie = {
  id: string; // can be `tmdb-xxxx` or a slug
  title: string;
  rating: string;
  year: number;
  genresLabel: string;
  posterUrl: string;
  aiMatchPercent: number;
  reasonTags: [string, string, string];
};

/** Figma shows “Inception” — use tmdb id for realism. */
export const onboardingHeroPreview: OnboardingMovie = {
  id: 'tmdb-27205',
  title: 'Inception',
  rating: '8.6',
  year: 2010,
  genresLabel: 'Sci‑Fi / Action',
  posterUrl: p('8IB2e4r4oVhHnANbnm7O3Tj6tF8.jpg'),
  aiMatchPercent: 90,
  reasonTags: ['Atmospheric', 'Epic', 'Dark'],
};

/** 10 onboarding movies to rate (mock). */
export const onboardingMovies: OnboardingMovie[] = [
  onboardingHeroPreview,
  {
    id: 'fight-club',
    title: 'Fight Club',
    rating: '8.6',
    year: 1999,
    genresLabel: 'Drama / Thriller',
    posterUrl: p('pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg'),
    aiMatchPercent: 88,
    reasonTags: ['Dark', 'Twisty', 'Cult'],
  },
  {
    id: 'parasite',
    title: 'Parasite',
    rating: '8.5',
    year: 2019,
    genresLabel: 'Thriller / Drama',
    posterUrl: p('7IiTTgloJzvGI1TAYymCfbfl3vT.jpg'),
    aiMatchPercent: 86,
    reasonTags: ['Smart', 'Tense', 'Social'],
  },
  {
    id: 'burning',
    title: 'Burning',
    rating: '7.5',
    year: 2018,
    genresLabel: 'Thriller / Mystery',
    posterUrl: p('b9cZgtzcG2QbttylSWMJCdHU0NK.jpg'),
    aiMatchPercent: 84,
    reasonTags: ['Slow burn', 'Atmospheric', 'Unsettling'],
  },
  {
    id: 'past-lives',
    title: 'Past Lives',
    rating: '8.1',
    year: 2023,
    genresLabel: 'Drama / Romance',
    posterUrl: p('k3waqVXSnvCZWfJYNtdamTgTtTA.jpg'),
    aiMatchPercent: 82,
    reasonTags: ['Tender', 'Real', 'Quiet'],
  },
  {
    id: 'decision-to-leave',
    title: 'Decision to Leave',
    rating: '7.3',
    year: 2022,
    genresLabel: 'Mystery / Romance',
    posterUrl: p('cAoAgzOCxSytYBqqCQulhXNR3LB.jpg'),
    aiMatchPercent: 81,
    reasonTags: ['Stylish', 'Mysterious', 'Intimate'],
  },
  {
    id: 'aftersun',
    title: 'Aftersun',
    rating: '7.6',
    year: 2022,
    genresLabel: 'Drama',
    posterUrl: p('evKz85EKouVbIr51zy5fOtpNRPg.jpg'),
    aiMatchPercent: 80,
    reasonTags: ['Tender', 'Bittersweet', 'Quiet'],
  },
  {
    id: 'portrait-of-a-lady-on-fire',
    title: 'Portrait of a Lady on Fire',
    rating: '8.1',
    year: 2019,
    genresLabel: 'Drama / Romance',
    posterUrl: p('2LquGwEhbg3soxSCs9VNyh5VJd9.jpg'),
    aiMatchPercent: 79,
    reasonTags: ['Gorgeous', 'Intense', 'Romantic'],
  },
  {
    id: 'the-fight',
    title: 'The Fight',
    rating: '6.2',
    year: 2019,
    genresLabel: 'Sci‑Fi / Action',
    posterUrl: p('3bhkrj58Vtu7enYsRolD1fJpdPy.jpg'),
    aiMatchPercent: 78,
    reasonTags: ['Epic', 'Fast', 'Sci‑Fi'],
  },
  {
    id: 'tmdb-550',
    title: 'Heat',
    rating: '8.2',
    year: 1995,
    genresLabel: 'Crime / Thriller',
    posterUrl: p('zMyfPUelumio3tiDKPffaUpsQTD.jpg'),
    aiMatchPercent: 77,
    reasonTags: ['Crime', 'Tense', 'Classic'],
  },
];

