import { useSyncExternalStore } from 'react'

export interface MusicState {
  playing: boolean
  muted: boolean
  volume: number
  track: string
  ready: boolean
  uploaded: boolean
}

let state: MusicState = {
  playing: false,
  muted: false,
  volume: 0.7,
  track: 'Happy Birthday · music box',
  ready: false,
  uploaded: false,
}

const listeners = new Set<() => void>()

function commit(patch: Partial<MusicState>) {
  state = { ...state, ...patch }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function snapshot() {
  return state
}

export function useMusic() {
  return useSyncExternalStore(subscribe, snapshot, snapshot)
}

type AudioWindow = Window & { webkitAudioContext?: typeof AudioContext }

let ctx: AudioContext | null = null
let master: GainNode | null = null
let source: AudioBufferSourceNode | null = null
let buffer: AudioBuffer | null = null
let offset = 0
let startedAt = 0
let fileAudio: HTMLAudioElement | null = null
let objectUrl: string | null = null
let initialised = false

function targetGain() {
  return state.muted ? 0 : state.volume * 0.85
}

function ensureContext(): AudioContext | null {
  if (ctx) return ctx
  if (typeof window === 'undefined') return null
  const Ctor = window.AudioContext ?? (window as AudioWindow).webkitAudioContext
  if (!Ctor) return null
  ctx = new Ctor()
  master = ctx.createGain()
  master.gain.value = targetGain()
  master.connect(ctx.destination)
  return ctx
}

function applyVolume() {
  if (master && ctx) master.gain.setTargetAtTime(targetGain(), ctx.currentTime, 0.04)
  if (fileAudio) {
    fileAudio.volume = state.volume
    fileAudio.muted = state.muted
  }
}

function stopProcedural() {
  if (!source) return
  try {
    source.stop()
  } catch {
    // Already stopped.
  }
  source.disconnect()
  source = null
}

const MELODY: Array<[number, number, number]> = [
  [392, 0, 1.1],
  [392, 0.75, 1.1],
  [440, 1.5, 1.1],
  [392, 2.25, 1.1],
  [523.25, 3, 1.4],
  [493.88, 3.75, 1.8],
  [392, 5.25, 1.1],
  [392, 6, 1.1],
  [440, 6.75, 1.1],
  [392, 7.5, 1.1],
  [587.33, 8.25, 1.4],
  [523.25, 9, 1.8],
  [392, 10.5, 1.1],
  [392, 11.25, 1.1],
  [783.99, 12, 1.3],
  [659.25, 12.75, 1.1],
  [523.25, 13.5, 1.4],
  [493.88, 14.25, 1.2],
  [440, 15, 1.5],
  [698.46, 15.75, 1.1],
  [698.46, 16.5, 1.1],
  [659.25, 17.25, 1.1],
  [523.25, 18, 1.3],
  [587.33, 18.75, 1.2],
  [523.25, 19.5, 2.2],
]

const CHORDS: Array<{ start: number; notes: number[] }> = [
  { start: 0, notes: [130.81, 196, 261.63] },
  { start: 5.25, notes: [174.61, 261.63, 349.23] },
  { start: 10.5, notes: [196, 293.66, 392] },
  { start: 15.75, notes: [130.81, 196, 261.63] },
]

/** A gentle music-box arrangement of the public-domain birthday melody. */
function buildBirthdayBuffer(ac: AudioContext): AudioBuffer {
  const duration = 22.5
  const rate = ac.sampleRate
  const result = ac.createBuffer(2, Math.floor(duration * rate), rate)
  const left = result.getChannelData(0)
  const right = result.getChannelData(1)

  const tone = (freq: number, start: number, length: number, level: number, pan: number) => {
    const first = Math.floor(start * rate)
    const count = Math.min(Math.floor((length + 1.6) * rate), left.length - first)
    for (let i = 0; i < count; i += 1) {
      const t = i / rate
      const env = (1 - Math.exp(-t * 150)) * Math.exp(-t * 2.4)
      const wobble = 1 + Math.sin(t * 5.1 + start) * 0.0024
      const phase = Math.PI * 2 * freq * wobble * t
      const sample =
        (Math.sin(phase) + 0.3 * Math.sin(phase * 2.002) + 0.08 * Math.sin(phase * 3.997)) *
        env *
        level
      left[first + i] += sample * (1 - pan * 0.4)
      right[first + i] += sample * (1 + pan * 0.4)
    }
  }

  const pad = (freq: number, start: number, length: number) => {
    const first = Math.floor(start * rate)
    const count = Math.min(Math.floor(length * rate), left.length - first)
    for (let i = 0; i < count; i += 1) {
      const t = i / rate
      const env = Math.min(1, t / 1.4) * Math.min(1, (length - t) / 1.6)
      const sample =
        Math.sin(Math.PI * 2 * freq * t + Math.sin(t * 0.35) * 0.6) * env * 0.012
      left[first + i] += sample
      right[first + i] += sample
    }
  }

  MELODY.forEach(([freq, start, length], index) => {
    tone(freq, start, length, 0.11, index % 2 === 0 ? -0.18 : 0.18)
  })
  CHORDS.forEach((chord) => chord.notes.forEach((freq) => pad(freq, chord.start, 5.25)))

  const fadeIn = Math.floor(rate * 0.08)
  const fadeOut = Math.floor(rate * 0.6)
  for (let i = 0; i < fadeIn; i += 1) {
    const k = i / fadeIn
    left[i] *= k
    right[i] *= k
  }
  for (let i = 0; i < fadeOut; i += 1) {
    const k = i / fadeOut
    const index = left.length - 1 - i
    left[index] *= k
    right[index] *= k
  }

  return result
}

/** Load the optional file from the config; it only plays after a user action. */
export function initMusic(src: string, title: string) {
  if (initialised) return
  initialised = true
  if (!state.uploaded) commit({ track: title })
  if (src) {
    fileAudio = new Audio(src)
    fileAudio.loop = true
    fileAudio.preload = 'metadata'
    fileAudio.volume = state.volume
  }
}

export async function playMusic() {
  if (fileAudio) {
    try {
      await fileAudio.play()
      commit({ playing: true, ready: true })
    } catch {
      commit({ playing: false })
    }
    return
  }

  const ac = ensureContext()
  if (!ac) return
  if (ac.state === 'suspended') await ac.resume()
  if (!buffer) buffer = buildBirthdayBuffer(ac)

  if (!source) {
    source = ac.createBufferSource()
    source.buffer = buffer
    source.loop = true
    source.connect(master as GainNode)
    source.start(0, offset % buffer.duration)
    startedAt = ac.currentTime
  }

  applyVolume()
  commit({ playing: true, ready: true })
}

export function pauseMusic() {
  if (fileAudio) {
    fileAudio.pause()
  } else if (source && ctx && buffer) {
    offset = (offset + (ctx.currentTime - startedAt)) % buffer.duration
    stopProcedural()
  }
  commit({ playing: false })
}

export function toggleMusic() {
  if (state.playing) pauseMusic()
  else void playMusic()
}

export function setVolume(value: number) {
  const volume = Math.min(1, Math.max(0, value))
  commit({ volume, muted: volume > 0 ? false : state.muted })
  applyVolume()
}

export function toggleMuted() {
  commit({ muted: !state.muted })
  applyVolume()
}

export async function loadMusicFile(file: File) {
  if (!file.type.startsWith('audio/') && !/\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(file.name)) {
    return
  }
  if (state.playing) pauseMusic()
  stopProcedural()
  if (fileAudio) {
    fileAudio.pause()
    fileAudio.src = ''
  }
  if (objectUrl) URL.revokeObjectURL(objectUrl)
  objectUrl = URL.createObjectURL(file)

  const audio = new Audio(objectUrl)
  audio.loop = true
  audio.volume = state.volume
  audio.muted = state.muted
  fileAudio = audio

  commit({ track: file.name, uploaded: true, playing: false, ready: false })
  try {
    await audio.play()
    commit({ playing: true, ready: true })
  } catch {
    commit({ playing: false })
  }
}
