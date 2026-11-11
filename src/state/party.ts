import { useSyncExternalStore } from 'react'

export const SCENES = [
  { id: 'welcome', label: 'Welcome', numeral: 'I' },
  { id: 'cake', label: 'The Cake', numeral: 'II' },
  { id: 'cut', label: 'The Slice', numeral: 'III' },
  { id: 'balloons', label: 'Balloons', numeral: 'IV' },
  { id: 'gifts', label: 'The Gifts', numeral: 'V' },
  { id: 'memories', label: 'Memories', numeral: 'VI' },
  { id: 'letter', label: 'The Letter', numeral: 'VII' },
  { id: 'finale', label: 'Finale', numeral: 'VIII' },
] as const

export type SceneId = (typeof SCENES)[number]['id']

export const CANDLE_COUNT = 8
export const POP_GOAL = 5

export type GiftId = 'wish' | 'photo' | 'appreciation' | 'mystery'

export interface BalloonNote {
  id: string
  text: string
}

export interface PartyState {
  scene: number
  maxVisited: number
  audio: boolean
  entered: boolean
  /** indices of candles currently burning */
  litCandles: number[]
  wishMade: boolean
  cakeCut: boolean
  /** ids of balloons that have been popped */
  popped: string[]
  /** the last hidden note a balloon revealed */
  lastMessage: BalloonNote | null
  openedGifts: GiftId[]
  activeGift: GiftId | null
  memoryIndex: number
  letterOpen: boolean
}

const initialState: PartyState = {
  scene: 0,
  maxVisited: 0,
  audio: true,
  entered: false,
  litCandles: [],
  wishMade: false,
  cakeCut: false,
  popped: [],
  lastMessage: null,
  openedGifts: [],
  activeGift: null,
  memoryIndex: 0,
  letterOpen: false,
}

let state: PartyState = { ...initialState }
const listeners = new Set<() => void>()

function commit(patch: Partial<PartyState>) {
  state = { ...state, ...patch }
  listeners.forEach((listener) => listener())
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getState(): PartyState {
  return state
}

export function useParty(): PartyState {
  return useSyncExternalStore(subscribe, getState, getState)
}

export function setScene(index: number) {
  const target = Math.max(0, Math.min(SCENES.length - 1, index))
  if (state.scene === target) return
  commit({ scene: target, maxVisited: Math.max(state.maxVisited, target) })
}

export function nextScene() {
  setScene(state.scene + 1)
}

export function previousScene() {
  setScene(state.scene - 1)
}

export function enterCelebration() {
  commit({ entered: true })
  setScene(1)
}

export function toggleAudio() {
  commit({ audio: !state.audio })
}

export function toggleCandle(index: number) {
  const lit = state.litCandles.includes(index)
    ? state.litCandles.filter((entry) => entry !== index)
    : [...state.litCandles, index]
  commit({ litCandles: lit })
}

export function lightAllCandles() {
  commit({ litCandles: Array.from({ length: CANDLE_COUNT }, (_, i) => i) })
}

export function blowOutCandles() {
  commit({ litCandles: [], wishMade: true })
}

export function cutCake() {
  commit({ cakeCut: true })
}

export function popBalloon(id: string, message?: string) {
  if (state.popped.includes(id)) return
  commit({
    popped: [...state.popped, id],
    lastMessage: message ? { id, text: message } : state.lastMessage,
  })
}

export function clearBalloonNote() {
  if (!state.lastMessage) return
  commit({ lastMessage: null })
}

export function openGift(id: GiftId) {
  const opened = state.openedGifts.includes(id)
  commit({
    openedGifts: opened ? state.openedGifts : [...state.openedGifts, id],
    activeGift: id,
  })
}

export function setMemory(index: number) {
  commit({ memoryIndex: Math.max(0, Math.min(4, index)) })
}

export function openLetter() {
  commit({ letterOpen: true })
}

export function resetLetter() {
  if (!state.letterOpen) return
  commit({ letterOpen: false })
}

/** Puts the cake back together and blows the candles out. */
export function resetCake() {
  commit({ litCandles: [], wishMade: false, cakeCut: false })
}

export function replay() {
  const { audio } = state
  state = { ...initialState, audio }
  listeners.forEach((listener) => listener())
}

export function isActivityDone(index: number): boolean {
  switch (SCENES[index]?.id) {
    case 'cake':
      return state.wishMade
    case 'cut':
      return state.cakeCut
    case 'balloons':
      return state.popped.length >= POP_GOAL
    case 'gifts':
      return state.openedGifts.length > 0
    default:
      return true
  }
}

export function gateMet(_index: number): boolean {
  // Always allow fluid navigation so she can freely explore all scenes without being trapped
  return true
}

export function gateHint(index: number): string {
  switch (SCENES[index]?.id) {
    case 'cake':
      return state.wishMade
        ? 'Wish made ✨'
        : state.litCandles.length === 0
          ? 'Light the candles to make a wish'
          : 'Close your eyes and make a wish'
    case 'cut':
      return state.cakeCut ? 'First slice taken 🍰' : 'Cut the cake for good luck'
    case 'balloons':
      return state.popped.length >= POP_GOAL
        ? 'All wishes revealed 🎈'
        : `${state.popped.length}/${POP_GOAL} balloons popped`
    case 'gifts':
      return state.openedGifts.length > 0 ? 'Gifts unwrapped 🎁' : 'Open a gift box'
    default:
      return ''
  }
}
