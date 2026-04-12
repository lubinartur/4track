import type { ItemDetail } from '@/types/item';
import type { MovieItem } from '@/types/movie';

const p = (file: string) => `https://image.tmdb.org/t/p/w500/${file}`;

const fightClubBackdrop = p('wH2KHqxQ65rJGUJFWxC1AR02t79.jpg');
const fightClubPoster = p('pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg');

/**
 * Canonical movie cards for “Similar for you” and cross-links.
 * Every title that appears in the app should have an `itemSlug` here.
 */
const movieCardBySlug: Record<string, MovieItem> = {
  'fight-club': {
    id: 'c-fc',
    title: 'Fight Club',
    rating: '4.3',
    year: 1999,
    genre: 'Drama',
    posterUrl: fightClubPoster,
    itemSlug: 'fight-club',
  },
  burning: {
    id: 'c-bu',
    title: 'Burning',
    rating: '4.3',
    year: 2018,
    genre: 'Thriller',
    posterUrl: p('b9cZgtzcG2QbttylSWMJCdHU0NK.jpg'),
    itemSlug: 'burning',
  },
  'decision-to-leave': {
    id: 'c-dtl',
    title: 'Decision to Leave',
    rating: '4.0',
    year: 2022,
    genre: 'Mystery',
    posterUrl: p('cAoAgzOCxSytYBqqCQulhXNR3LB.jpg'),
    itemSlug: 'decision-to-leave',
  },
  parasite: {
    id: 'c-pa',
    title: 'Parasite',
    rating: '4.5',
    year: 2019,
    genre: 'Thriller',
    posterUrl: p('7IiTTgloJzvGI1TAYymCfbfl3vT.jpg'),
    itemSlug: 'parasite',
  },
  'past-lives': {
    id: 'c-pl',
    title: 'Past Lives',
    rating: '4.2',
    year: 2023,
    genre: 'Drama',
    posterUrl: p('k3waqVXSnvCZWfJYNtdamTgTtTA.jpg'),
    itemSlug: 'past-lives',
  },
  aftersun: {
    id: 'c-as',
    title: 'Aftersun',
    rating: '4.1',
    year: 2022,
    genre: 'Drama',
    posterUrl: p('evKz85EKouVbIr51zy5fOtpNRPg.jpg'),
    itemSlug: 'aftersun',
  },
  'portrait-of-a-lady-on-fire': {
    id: 'c-pf',
    title: 'Portrait of a Lady on Fire',
    rating: '4.4',
    year: 2019,
    genre: 'Romance',
    posterUrl: p('2LquGwEhbg3soxSCs9VNyh5VJd9.jpg'),
    itemSlug: 'portrait-of-a-lady-on-fire',
  },
  'saint-maud': {
    id: 'c-sm',
    title: 'Saint Maud',
    rating: '3.9',
    year: 2019,
    genre: 'Horror',
    posterUrl: p('6mPNdmjdbVKPITv3LLCmQoKs9Zw.jpg'),
    itemSlug: 'saint-maud',
  },
  'the-rider': {
    id: 'c-tr',
    title: 'The Rider',
    rating: '4.0',
    year: 2017,
    genre: 'Drama',
    posterUrl: p('2szdEK0Mr0RG0nWGFVTseNQHbnP.jpg'),
    itemSlug: 'the-rider',
  },
  columbus: {
    id: 'c-co',
    title: 'Columbus',
    rating: '3.8',
    year: 2017,
    genre: 'Drama',
    posterUrl: p('sEhC3tuiqIdTCahOf2F99M3aQv7.jpg'),
    itemSlug: 'columbus',
  },
  'the-fight': {
    id: 'c-tf',
    title: 'The Fight',
    rating: '3.5',
    year: 2019,
    genre: 'Action',
    posterUrl: p('3bhkrj58Vtu7enYsRolD1fJpdPy.jpg'),
    itemSlug: 'the-fight',
  },
};

const SLUG_ORDER = Object.keys(movieCardBySlug);

function similarFor(slug: string, take = 4): MovieItem[] {
  return SLUG_ORDER.filter((s) => s !== slug)
    .slice(0, take)
    .map((s) => movieCardBySlug[s]);
}

export const itemDetailsById: Record<string, ItemDetail> = {
  'fight-club': {
    id: 'fight-club',
    tmdbId: 550,
    title: 'Fight Club',
    rating: '8.6',
    year: 1999,
    genresLabel: 'Drama / Thriller',
    posterUrl: fightClubPoster,
    backdropUrl: fightClubBackdrop,
    overview:
      'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.',
    credits: {
      director: 'David Fincher',
      lead: 'Brad Pitt',
      music: 'The Dust Brothers',
      studio: '20th Century Fox',
    },
    tasteInsight: {
      entryCount: 18,
      description:
        'You tend to rate twist-heavy dramas and anti-hero stories highly — especially when the tone stays grounded and cynical.',
    },
    heroAiMatchPercent: 88,
    heroReasonTags: ['Psychological', 'Dark', 'Satire'],
    similar: similarFor('fight-club', 3),
  },

  burning: {
    id: 'burning',
    tmdbId: 491584,
    title: 'Burning',
    rating: '7.5',
    year: 2018,
    genresLabel: 'Thriller / Mystery',
    posterUrl: movieCardBySlug.burning.posterUrl,
    backdropUrl: movieCardBySlug.burning.posterUrl,
    overview:
      'Jong-su bumps into a girl who grew up in the same neighborhood, who asks him to look after her cat while on a trip — and introduces a mysterious stranger.',
    credits: {
      director: 'Lee Chang-dong',
      lead: 'Yoo Ah-in',
      music: 'Mowg',
      studio: 'Pinehouse Film',
    },
    tasteInsight: {
      entryCount: 11,
      description:
        'You often save slow-burn mysteries where the tension comes from what’s unsaid — rural settings and unreliable perspectives are a pattern.',
    },
    heroAiMatchPercent: 84,
    heroReasonTags: ['Slow Burn', 'Mystery', 'Ambiguous'],
    similar: similarFor('burning'),
  },

  'decision-to-leave': {
    id: 'decision-to-leave',
    tmdbId: 666277,
    title: 'Decision to Leave',
    rating: '7.3',
    year: 2022,
    genresLabel: 'Mystery / Romance',
    posterUrl: movieCardBySlug['decision-to-leave'].posterUrl,
    backdropUrl: movieCardBySlug['decision-to-leave'].posterUrl,
    overview:
      'A detective investigating a man’s fall from a mountain is drawn into an unexpected emotional entanglement with the man’s wife.',
    credits: {
      director: 'Park Chan-wook',
      lead: 'Park Hae-il',
      music: 'Jo Yeong-wook',
      studio: 'Moho Film',
    },
    tasteInsight: {
      entryCount: 14,
      description:
        'Romance-as-thriller is a sweet spot for you: morally gray leads, precise framing, and emotions that turn on a single glance.',
    },
    heroAiMatchPercent: 87,
    heroReasonTags: ['Noir', 'Romance', 'Moral doubt'],
    similar: similarFor('decision-to-leave'),
  },

  parasite: {
    id: 'parasite',
    tmdbId: 496243,
    title: 'Parasite',
    rating: '8.5',
    year: 2019,
    genresLabel: 'Thriller / Drama',
    posterUrl: movieCardBySlug.parasite.posterUrl,
    backdropUrl: movieCardBySlug.parasite.posterUrl,
    overview:
      'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    credits: {
      director: 'Bong Joon-ho',
      lead: 'Song Kang-ho',
      music: 'Jung Jae-il',
      studio: 'Barunson E&A',
    },
    tasteInsight: {
      entryCount: 22,
      description:
        'Satire with sharp class commentary lands strongly — you’ve liked ensemble casts where comedy and dread share the same scene.',
    },
    heroAiMatchPercent: 92,
    heroReasonTags: ['Satire', 'Social', 'Tension'],
    similar: similarFor('parasite'),
  },

  'past-lives': {
    id: 'past-lives',
    tmdbId: 820885,
    title: 'Past Lives',
    rating: '8.1',
    year: 2023,
    genresLabel: 'Drama / Romance',
    posterUrl: movieCardBySlug['past-lives'].posterUrl,
    backdropUrl: movieCardBySlug['past-lives'].posterUrl,
    overview:
      'Nora and Hae Sung, two deeply connected childhood friends, are torn apart after Nora’s family emigrates from South Korea. Decades later, they reunite for one fateful week.',
    credits: {
      director: 'Celine Song',
      lead: 'Greta Lee',
      music: 'Christopher Bear & Daniel Rossen',
      studio: 'A24',
    },
    tasteInsight: {
      entryCount: 16,
      description:
        'You gravitate toward restrained love stories where time and distance shape the emotional arc more than plot twists.',
    },
    heroAiMatchPercent: 83,
    heroReasonTags: ['Intimate', 'Bittersweet', 'Longing'],
    similar: similarFor('past-lives'),
  },

  aftersun: {
    id: 'aftersun',
    tmdbId: 965582,
    title: 'Aftersun',
    rating: '7.7',
    year: 2022,
    genresLabel: 'Drama',
    posterUrl: movieCardBySlug.aftersun.posterUrl,
    backdropUrl: movieCardBySlug.aftersun.posterUrl,
    overview:
      'Sophie reflects on the shared joy and private melancholy of a holiday she took with her father twenty years earlier. Memories real and imagined fill the gaps between miniDV footage.',
    credits: {
      director: 'Charlotte Wells',
      lead: 'Paul Mescal',
      music: 'Oliver Coates',
      studio: 'BBC Film',
    },
    tasteInsight: {
      entryCount: 13,
      description:
        'Quiet, sun-drenched dramas with uneasy undercurrents match how you save films that feel personal and unresolved.',
    },
    heroAiMatchPercent: 81,
    heroReasonTags: ['Melancholic', 'Memory', 'Family'],
    similar: similarFor('aftersun'),
  },

  'portrait-of-a-lady-on-fire': {
    id: 'portrait-of-a-lady-on-fire',
    tmdbId: 531428,
    title: 'Portrait of a Lady on Fire',
    rating: '8.1',
    year: 2019,
    genresLabel: 'Romance / Drama',
    posterUrl: movieCardBySlug['portrait-of-a-lady-on-fire'].posterUrl,
    backdropUrl: movieCardBySlug['portrait-of-a-lady-on-fire'].posterUrl,
    overview:
      'On an isolated island in Brittany at the end of the eighteenth century, a female painter is obliged to paint a wedding portrait of a young woman.',
    credits: {
      director: 'Céline Sciamma',
      lead: 'Noémie Merlant',
      music: 'Jean-Baptiste de Laubier',
      studio: 'Lilies Films',
    },
    tasteInsight: {
      entryCount: 15,
      description:
        'You respond to painterly framing and slow-burn intimacy — stories where desire is expressed through glances and craft.',
    },
    heroAiMatchPercent: 86,
    heroReasonTags: ['Period', 'Queer romance', 'Visual'],
    similar: similarFor('portrait-of-a-lady-on-fire'),
  },

  'saint-maud': {
    id: 'saint-maud',
    tmdbId: 575776,
    title: 'Saint Maud',
    rating: '6.7',
    year: 2019,
    genresLabel: 'Horror / Thriller',
    posterUrl: movieCardBySlug['saint-maud'].posterUrl,
    backdropUrl: movieCardBySlug['saint-maud'].posterUrl,
    overview:
      'A newly devout hospice nurse becomes obsessed with saving her dying patient’s soul — but sinister forces and her own fractured mind blur the line between salvation and possession.',
    credits: {
      director: 'Rose Glass',
      lead: 'Morfydd Clark',
      music: 'Adam Janota Bzowski',
      studio: 'Film4',
    },
    tasteInsight: {
      entryCount: 10,
      description:
        'Psychological horror with a singular voice is a pattern — you save films where dread comes from conviction, not jump scares.',
    },
    heroAiMatchPercent: 79,
    heroReasonTags: ['Religious dread', 'Isolation', 'Psychological'],
    similar: similarFor('saint-maud'),
  },

  'the-rider': {
    id: 'the-rider',
    tmdbId: 372842,
    title: 'The Rider',
    rating: '7.4',
    year: 2017,
    genresLabel: 'Drama / Western',
    posterUrl: movieCardBySlug['the-rider'].posterUrl,
    backdropUrl: movieCardBySlug['the-rider'].posterUrl,
    overview:
      'After suffering a near-fatal head injury, a young cowboy undertakes a search for identity and what it means to be a man in the heartland of America.',
    credits: {
      director: 'Chloé Zhao',
      lead: 'Brady Jandreau',
      music: 'Nathan Halpern',
      studio: 'Sony Pictures Classics',
    },
    tasteInsight: {
      entryCount: 12,
      description:
        'Neo-westerns with documentary texture land with you — quiet masculinity, landscape as character, and moral restraint.',
    },
    heroAiMatchPercent: 82,
    heroReasonTags: ['Neo-western', 'Quiet', 'Landscape'],
    similar: similarFor('the-rider'),
  },

  columbus: {
    id: 'columbus',
    tmdbId: 396806,
    title: 'Columbus',
    rating: '7.2',
    year: 2017,
    genresLabel: 'Drama / Romance',
    posterUrl: movieCardBySlug.columbus.posterUrl,
    backdropUrl: movieCardBySlug.columbus.posterUrl,
    overview:
      'A Korean-born man finds himself stuck in Columbus, Indiana, where his architect father is in a coma, and meets a young woman who wants to stay in town with her mother.',
    credits: {
      director: 'Kogonada',
      lead: 'John Cho',
      music: 'Hammock',
      studio: 'Depth of Field',
    },
    tasteInsight: {
      entryCount: 9,
      description:
        'Architecture-as-emotion is a through-line — you like films where space, light, and silence carry as much weight as dialogue.',
    },
    heroAiMatchPercent: 80,
    heroReasonTags: ['Architecture', 'Quiet', 'Humanist'],
    similar: similarFor('columbus'),
  },

  'the-fight': {
    id: 'the-fight',
    title: 'The Fight',
    rating: '6.2',
    year: 2019,
    genresLabel: 'Action / Drama',
    posterUrl: movieCardBySlug['the-fight'].posterUrl,
    backdropUrl: movieCardBySlug['the-fight'].posterUrl,
    overview:
      'An underdog boxer struggles to balance family, debt, and the chance at one last shot in the ring — a lean sports drama about grit and second chances.',
    credits: {
      director: 'TBD',
      lead: 'TBD',
      music: 'TBD',
      studio: 'TBD',
    },
    tasteInsight: {
      entryCount: 6,
      description:
        'You sometimes save lean character-driven sports stories where the stakes feel personal rather than epic.',
    },
    heroAiMatchPercent: 74,
    heroReasonTags: ['Underdog', 'Sports', 'Grit'],
    similar: similarFor('the-fight'),
  },
};

/** TMDB numeric id → item slug (for Discover search linking). */
export const slugByTmdbId: Record<number, string> = {};
for (const [slug, detail] of Object.entries(itemDetailsById)) {
  if (typeof detail.tmdbId === 'number') {
    slugByTmdbId[detail.tmdbId] = slug;
  }
}

/** Resolves item data for a known slug; unknown routes should 404. */
export function getItemDetail(id: string): ItemDetail | null {
  return itemDetailsById[id] ?? null;
}

export const itemRouteIds = Object.keys(itemDetailsById);
