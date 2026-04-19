/** TMDB poster CDN — matches Discover / Item mocks */
const p = (file: string) => `https://image.tmdb.org/t/p/w500/${file}`;

/** Row playback bucket — favorites use `favorite: true` separately. */
export type LibraryListStatus = 'queue' | 'watched';

/** Top tabs (Favorites is derived from `favorite`, not `status`). */
export type LibraryTabId = 'queue' | 'watched' | 'favorites';

export type LibraryEntry = {
  id: string;
  title: string;
  rating: string;
  year: number;
  genresLabel: string;
  posterUrl: string;
  itemSlug?: string;
  status: LibraryListStatus;
  favorite: boolean;
  /** User star rating 1–5 after completing the rate sheet; omitted if never rated. */
  userRating?: number;
  tasteTags: string[];
};

/** Canonical `id` / store key = `itemSlug` or `tmdb-{id}` */
export const libraryEntries: LibraryEntry[] = [
  {
    id: 'fight-club',
    title: 'Fight Club',
    rating: '8.6',
    year: 1999,
    genresLabel: 'Drama / Thriller',
    posterUrl: p('pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg'),
    itemSlug: 'fight-club',
    status: 'queue',
    favorite: false,
    tasteTags: [],
  },
  {
    id: 'the-fight',
    title: 'The Fight',
    rating: '6.2',
    year: 2019,
    genresLabel: 'Sci-Fi / Action',
    posterUrl: p('3bhkrj58Vtu7enYsRolD1fJpdPy.jpg'),
    itemSlug: 'the-fight',
    status: 'queue',
    favorite: false,
    tasteTags: [],
  },
  {
    id: 'parasite',
    title: 'Parasite',
    rating: '8.5',
    year: 2019,
    genresLabel: 'Thriller / Drama',
    posterUrl: p('7IiTTgloJzvGI1TAYymCfbfl3vT.jpg'),
    itemSlug: 'parasite',
    status: 'watched',
    favorite: false,
    tasteTags: [],
  },
  {
    id: 'burning',
    title: 'Burning',
    rating: '7.5',
    year: 2018,
    genresLabel: 'Thriller / Mystery',
    posterUrl: p('b9cZgtzcG2QbttylSWMJCdHU0NK.jpg'),
    itemSlug: 'burning',
    status: 'watched',
    favorite: false,
    tasteTags: [],
  },
  {
    id: 'past-lives',
    title: 'Past Lives',
    rating: '8.1',
    year: 2023,
    genresLabel: 'Drama / Romance',
    posterUrl: p('k3waqVXSnvCZWfJYNtdamTgTtTA.jpg'),
    itemSlug: 'past-lives',
    status: 'watched',
    favorite: false,
    tasteTags: [],
  },
  {
    id: 'decision-to-leave',
    title: 'Decision to Leave',
    rating: '7.3',
    year: 2022,
    genresLabel: 'Mystery / Romance',
    posterUrl: p('cAoAgzOCxSytYBqqCQulhXNR3LB.jpg'),
    itemSlug: 'decision-to-leave',
    status: 'watched',
    favorite: true,
    tasteTags: [],
  },
];

export function libraryTabCounts(entries: LibraryEntry[]): Record<LibraryTabId, number> {
  return {
    queue: entries.filter((e) => e.status === 'queue').length,
    watched: entries.filter((e) => e.status === 'watched').length,
    favorites: entries.filter((e) => e.favorite).length,
  };
}

export function libraryVisibleEntries(tab: LibraryTabId, entries: LibraryEntry[]): LibraryEntry[] {
  if (tab === 'queue') return entries.filter((e) => e.status === 'queue');
  if (tab === 'watched') return entries.filter((e) => e.status === 'watched');
  return entries.filter((e) => e.favorite);
}
