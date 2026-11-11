import type { MemoryMotif } from './data/content'

/* ============================================================
   YEABSERA · GOLDEN 25 — CONFIGURATION
   ============================================================ */

export interface PhotoToneSpec {
  from: string
  to: string
  ink: string
}

export type PhotoTone = 'rose' | 'gold' | 'plum' | 'ivory' | 'blush'

export const PHOTO_TONES: Record<PhotoTone, PhotoToneSpec> = {
  rose: { from: '#6b2438', to: '#d49a9b', ink: '#f8e3d5' },
  gold: { from: '#5c3420', to: '#e6bd83', ink: '#2c1216' },
  plum: { from: '#2e1420', to: '#8d5064', ink: '#f6dfc8' },
  ivory: { from: '#c39d74', to: '#f6e7d4', ink: '#4a2028' },
  blush: { from: '#7a3348', to: '#e9b6c3', ink: '#fdf1e4' },
}

export interface PhotoConfig {
  id: string
  src: string
  alt: string
  title: string
  date: string
  caption: string
  description: string
  motif: MemoryMotif
  tone: PhotoTone
}

export interface LetterConfig {
  prompt: string
  salutation: string
  paragraphs: string[]
  closing: string
}

export interface MusicConfig {
  src: string
  title: string
}

export interface ThemeConfig {
  ivory: string
  blush: string
  rose: string
  roseDeep: string
  gold: string
  goldSoft: string
  goldLight: string
  wine: string
  wine2: string
}

export interface BirthdayConfig {
  name: string
  firstName: string
  age: number
  welcomeSubtitle: string
  finaleSubtitle: string
  finaleNote: string
  letter: LetterConfig
  music: MusicConfig
  theme: ThemeConfig
  balloonMessages: string[]
  photos: PhotoConfig[]
}

export const BIRTHDAY: BirthdayConfig = {
  name: 'Yeabsera Terefe',
  firstName: 'Yeabsera',
  age: 25,

  welcomeSubtitle: 'A beautiful celebration for a beautiful soul.',

  finaleSubtitle: 'May your next chapter be even more beautiful than your dreams.',
  finaleNote: 'Twenty-five years of light — and the best is still ahead.',

  letter: {
    prompt: 'Yeabsera, someone has a special message for you!',
    salutation: 'My dearest Yeabsera,',
    paragraphs: [
      'Today we celebrate 25 beautiful years of you!',
      'I hope this new chapter brings you endless happiness, unforgettable memories, exciting opportunities and dreams that become reality.',
      'May you always find reasons to smile, courage to chase your dreams, and people who remind you how special you are.',
      'You deserve love, peace, success and all the beautiful things life has to offer.',
      'Happy 25th Birthday!',
    ],
    closing: 'Forever with love.',
  },

  music: {
    src: '',
    title: 'Happy Birthday · music box',
  },

  theme: {
    ivory: '#f0f7ff',
    blush: '#bae6fd',
    rose: '#7dd3fc',
    roseDeep: '#0284c7',
    gold: '#d7ab66',
    goldSoft: '#e8c894',
    goldLight: '#f9e7be',
    wine: '#081a30',
    wine2: '#0f2744',
  },

  balloonMessages: [
    'Keep shining, Yeabsera! ✨',
    'You deserve all the happiness in the world! 💖',
    '25 looks absolutely stunning on you! 👑',
    'Never stop chasing your beautiful dreams! 🌸',
    'Your best chapter is just beginning! 🌟',
  ],

  photos: [
    {
      id: 'hello',
      src: '/photos/yab.jpg',
      alt: 'Yeabsera portrait',
      title: 'The very first hello',
      date: 'The beginning',
      caption: 'A glowing smile with a very big future.',
      description:
        'Before the birthdays and the adventures, there was this — a beginning made entirely of light and joy.',
      motif: 'sparkler',
      tone: 'rose',
    },
    {
      id: 'laughter',
      src: '/photos/yab2.jpg',
      alt: 'Yeabsera smiling',
      title: 'That unmistakable laugh',
      date: 'Pure joy',
      caption: 'The laugh that starts quietly, then takes the whole room with it.',
      description:
        'If joy had a sound and a face, it would be this one. Keep this radiant smile forever.',
      motif: 'confetti',
      tone: 'gold',
    },
    {
      id: 'golden',
      src: '/photos/yab3.jpg',
      alt: 'Yeabsera in golden hour',
      title: 'Golden hour',
      date: 'A favourite afternoon',
      caption: 'The light found her and stayed.',
      description:
        'Some afternoons feel like poetry before anyone writes a word. This was one of them.',
      motif: 'candles',
      tone: 'plum',
    },
    {
      id: 'cake',
      src: '/photos/yab4.jpg',
      alt: 'Yeabsera celebration',
      title: 'Cake, candles, wishes',
      date: 'Every year',
      caption: 'One more year, one more wish.',
      description:
        'Every candle she has ever blown out is still here, still glowing, carrying dreams into reality.',
      motif: 'cake',
      tone: 'ivory',
    },
    {
      id: 'people',
      src: '/photos/yab5.jpg',
      alt: 'Yeabsera moments',
      title: 'Surrounded by love',
      date: 'Her presence',
      caption: 'The room is always warmer when she is in it.',
      description:
        'The best measure of a wonderful soul is how people feel around her. Pure grace and light.',
      motif: 'balloons',
      tone: 'blush',
    },
    {
      id: 'adventure',
      src: '/photos/yab6.jpg',
      alt: 'Yeabsera journey',
      title: 'A new adventure',
      date: 'Moving forward',
      caption: 'Curious heart, graceful steps.',
      description:
        'She walks forward with quiet strength and boundless grace. A journey worth celebrating.',
      motif: 'sparkler',
      tone: 'gold',
    },
    {
      id: 'dreamer',
      src: '/photos/yab.jpg',
      alt: 'Yeabsera dreaming',
      title: 'The dreamer',
      date: 'In her element',
      caption: 'Quietly building a life she is proud of.',
      description:
        'The plans she makes in quiet moments are the ones worth watching. They always bloom.',
      motif: 'candles',
      tone: 'rose',
    },
    {
      id: 'sunday',
      src: '/photos/yab2.jpg',
      alt: 'Yeabsera peaceful moment',
      title: 'Peace & light',
      date: 'A gentle day',
      caption: 'No hurry, just peaceful grace.',
      description:
        'A gentle reminder that true beauty does not shout. It simply shines like morning sunlight.',
      motif: 'confetti',
      tone: 'ivory',
    },
    {
      id: 'dance',
      src: '/photos/yab3.jpg',
      alt: 'Yeabsera joyful',
      title: 'Celebration of life',
      date: 'Golden moments',
      caption: 'Unapologetically herself.',
      description:
        'There is a particular kind of freedom in the way she smiles and embraces life.',
      motif: 'balloons',
      tone: 'plum',
    },
    {
      id: 'bloom',
      src: '/photos/yab4.jpg',
      alt: 'Yeabsera blooming',
      title: 'In full bloom',
      date: 'Chapter 25',
      caption: 'More radiant than ever.',
      description:
        'Growing looks stunning on her. Softer, braver, and stepping into her golden year.',
      motif: 'cake',
      tone: 'blush',
    },
    {
      id: 'proud',
      src: '/photos/yab5.jpg',
      alt: 'Yeabsera milestone',
      title: 'Milestones & dreams',
      date: 'Achieving',
      caption: 'Every step earned with heart.',
      description:
        'She worked with dedication and heart. That is what makes her journey so deeply inspiring.',
      motif: 'sparkler',
      tone: 'ivory',
    },
    {
      id: 'city',
      src: '/photos/yab6.jpg',
      alt: 'Yeabsera in the world',
      title: 'Bright horizons',
      date: 'The world awaits',
      caption: 'A bright soul in an open world.',
      description: 'Wherever she goes, she leaves warmth and kindness behind.',
      motif: 'confetti',
      tone: 'plum',
    },
    {
      id: 'home',
      src: '/photos/yab.jpg',
      alt: 'Yeabsera warmth',
      title: 'Warmth & kindness',
      date: 'Always',
      caption: 'Not just a smile — a comforting warmth.',
      description:
        'Warmth is the way she listens, the way she welcomes everyone, the way she makes people feel special.',
      motif: 'candles',
      tone: 'gold',
    },
    {
      id: 'sparkler',
      src: '/photos/yab2.jpg',
      alt: 'Yeabsera shining',
      title: 'Shining bright',
      date: 'Celebration',
      caption: 'Light in every step.',
      description:
        'May this golden 25th birthday be everything she dreamed of and so much more.',
      motif: 'sparkler',
      tone: 'rose',
    },
    {
      id: 'twentyfive',
      src: '/photos/yab3.jpg',
      alt: 'Yeabsera 25',
      title: 'Golden Twenty-Five',
      date: 'Today & always',
      caption: 'The beginning of her finest chapter.',
      description:
        'Twenty-five years of beauty, grace, and light. Happy Birthday, Yeabsera!',
      motif: 'balloons',
      tone: 'blush',
    },
  ],
}
