import type { GiftId } from '../state/party'
import type { WrapPattern } from '../lib/textures'

export type GiftKind = 'wish' | 'photo' | 'appreciation' | 'mystery'

export interface GiftPhotoSpec {
  src: string
  alt: string
  caption: string
}

export interface GiftTicket {
  label: string
  value: string
  note: string
}

export interface GiftSpec {
  id: GiftId
  label: string
  short: string
  kind: GiftKind
  title: string
  message: string
  photo?: GiftPhotoSpec
  ticket?: GiftTicket
  boxColor: string
  lidColor: string
  ribbonColor: string
  wrapColor: string
  wrap: WrapPattern
  ribbon: 'cross' | 'diagonal' | 'single' | 'double'
  size: number
  position: [number, number, number]
  rotation: number
}

export const GIFTS: GiftSpec[] = [
  {
    id: 'wish',
    label: 'The Rose Box',
    short: 'Wish',
    kind: 'wish',
    title: 'A wish for your twenty-fifth year',
    message:
      'May twenty-five hand you the things you have been too shy to ask for — the chance that scares you a little, the love that feels easy, and a hundred ordinary mornings that make you glad you stayed. You do not have to earn any of it. It is already yours.',
    boxColor: '#8f3f52',
    lidColor: '#a44d61',
    ribbonColor: '#e5c081',
    wrapColor: '#e5c081',
    wrap: 'pinstripe',
    ribbon: 'cross',
    size: 0.6,
    position: [-2.85, 0, 0.95],
    rotation: 0.18,
  },
  {
    id: 'photo',
    label: 'The Champagne Box',
    short: 'Photo',
    kind: 'photo',
    title: 'A photograph worth keeping',
    message:
      'Some moments deserve more than a camera roll. This one is for the wall, the wallet, or the lock screen — wherever you will see it on ordinary mornings.',
    photo: {
      src: '/photos/yab.jpg',
      alt: 'A favourite photograph of Yeabsera',
      caption: 'Golden hour, in your honour.',
    },
    boxColor: '#b98a4d',
    lidColor: '#cda05c',
    ribbonColor: '#f7ead4',
    wrapColor: '#f7ead4',
    wrap: 'damask',
    ribbon: 'diagonal',
    size: 0.7,
    position: [-1.75, 0, 1.85],
    rotation: -0.3,
  },
  {
    id: 'appreciation',
    label: 'The Ivory Box',
    short: 'Words',
    kind: 'appreciation',
    title: 'What we should say more often',
    message:
      'You are one of the rare people who makes a room feel warmer just by walking into it. Thank you for the way you listen, the way you show up, and the way you make people feel like they matter. The world is better because you are in it — and I am better because I know you.',
    boxColor: '#f2e3d3',
    lidColor: '#fbf2e6',
    ribbonColor: '#c9984f',
    wrapColor: '#c9984f',
    wrap: 'pearl',
    ribbon: 'single',
    size: 0.5,
    position: [-0.65, 0, 2.95],
    rotation: 0.46,
  },
  {
    id: 'mystery',
    label: 'The Midnight Box',
    short: 'Mystery',
    kind: 'mystery',
    title: 'The mystery gift',
    message:
      'No box could hold this one. What is inside is time — a whole day planned entirely around you: your favourite food, your favourite people, and nowhere at all that you have to be.',
    ticket: {
      label: 'The mystery gift',
      value: 'One golden day, entirely yours',
      note: 'Redeemable any day this year. Just say the word.',
    },
    boxColor: '#3a2233',
    lidColor: '#4a2a40',
    ribbonColor: '#e0a8a0',
    wrapColor: '#e8c894',
    wrap: 'constellation',
    ribbon: 'double',
    size: 0.58,
    position: [0.35, 0, 1.8],
    rotation: -0.12,
  },
]

export type MemoryMotif = 'sparkler' | 'cake' | 'balloons' | 'candles' | 'confetti'

export interface MemorySpec {
  id: string
  marker: string
  title: string
  caption: string
  motif: MemoryMotif
  from: string
  to: string
  ink: string
}

export const MEMORIES: MemorySpec[] = [
  {
    id: 'light',
    marker: 'Then',
    title: 'The girl made of light',
    caption: 'Some people arrive like a window opening. You have always been one of them.',
    motif: 'sparkler',
    from: '#5a1f33',
    to: '#c4748a',
    ink: '#f7ddc4',
  },
  {
    id: 'laughter',
    marker: 'Always',
    title: 'That laugh',
    caption: 'The one that starts quietly, then takes the whole room with it. Keep that one forever.',
    motif: 'confetti',
    from: '#7a3a2b',
    to: '#e0a777',
    ink: '#3a1a17',
  },
  {
    id: 'cake',
    marker: 'Every year',
    title: 'A little more cake',
    caption: 'Every birthday you have ever had, still here, still sweet, still asking for one more slice.',
    motif: 'cake',
    from: '#3f1a2a',
    to: '#b9798c',
    ink: '#f9ecdc',
  },
  {
    id: 'balloons',
    marker: 'Tonight',
    title: 'The room in gold',
    caption: 'Twenty-five candles, a hundred balloons, and one person worth all of it.',
    motif: 'balloons',
    from: '#6c2a36',
    to: '#e8bd85',
    ink: '#2c1016',
  },
  {
    id: 'next',
    marker: 'Next',
    title: 'The year ahead',
    caption: 'Softer mornings, braver choices, and a life that keeps getting more like you.',
    motif: 'candles',
    from: '#2e1420',
    to: '#8d5064',
    ink: '#f6dfc8',
  },
]

export const FINALE = {
  title: 'Twenty-five years of light.',
  subtitle: 'Happy birthday, Yeabsera.',
  note: 'May this year be everything you have been quietly hoping for — and then a little more.',
}
