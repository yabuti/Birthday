import { getState } from '../state/party'

let ctx: AudioContext | null = null

type WindowWithAudio = Window & { webkitAudioContext?: typeof AudioContext }

function context(): AudioContext | null {
  if (!getState().audio) return null
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as WindowWithAudio).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

let noiseBuffer: AudioBuffer | null = null

function noise(ac: AudioContext) {
  if (!noiseBuffer) {
    const length = Math.floor(ac.sampleRate * 0.5)
    noiseBuffer = ac.createBuffer(1, length, ac.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    let last = 0
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1
      last = 0.85 * last + 0.15 * white
      data[i] = last
    }
  }
  return noiseBuffer
}

interface ToneOptions {
  freq: number
  to?: number
  dur?: number
  gain?: number
  type?: OscillatorType
  delay?: number
}

function tone({ freq, to, dur = 0.9, gain = 0.06, type = 'sine', delay = 0 }: ToneOptions) {
  const ac = context()
  if (!ac) return
  const t0 = ac.currentTime + delay
  const osc = ac.createOscillator()
  const amp = ac.createGain()
  const filter = ac.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 4200
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (to) osc.frequency.exponentialRampToValueAtTime(Math.max(30, to), t0 + dur)
  amp.gain.setValueAtTime(0.0001, t0)
  amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.02)
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(filter).connect(amp).connect(ac.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

function noiseHit(gain: number, dur: number, freq: number, q = 1, type: BiquadFilterType = 'bandpass') {
  const ac = context()
  if (!ac) return
  const t0 = ac.currentTime
  const src = ac.createBufferSource()
  src.buffer = noise(ac)
  const filter = ac.createBiquadFilter()
  filter.type = type
  filter.frequency.setValueAtTime(freq, t0)
  filter.frequency.exponentialRampToValueAtTime(Math.max(120, freq * 0.25), t0 + dur)
  filter.Q.value = q
  const amp = ac.createGain()
  amp.gain.setValueAtTime(gain, t0)
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  src.connect(filter).connect(amp).connect(ac.destination)
  src.start(t0)
  src.stop(t0 + dur + 0.02)
}

export const sfx = {
  enter() {
    ;[523.25, 659.25, 783.99, 1046.5].forEach((freq, i) =>
      tone({ freq, dur: 1.6, gain: 0.05, type: 'sine', delay: i * 0.09 }),
    )
    tone({ freq: 2093, to: 3136, dur: 1.1, gain: 0.014, type: 'triangle', delay: 0.2 })
  },
  chime(freq = 880) {
    tone({ freq, dur: 1.2, gain: 0.04, type: 'sine' })
    tone({ freq: freq * 2, dur: 0.8, gain: 0.016, type: 'sine', delay: 0.03 })
  },
  sparkle() {
    ;[1318.5, 1567.98, 2093, 2637].forEach((freq, i) =>
      tone({ freq, dur: 0.5, gain: 0.022, type: 'triangle', delay: i * 0.055 }),
    )
  },
  pop() {
    noiseHit(0.16, 0.09, 1800, 0.9)
    tone({ freq: 320, to: 90, dur: 0.12, gain: 0.09, type: 'triangle' })
  },
  whoosh() {
    noiseHit(0.09, 0.7, 900, 0.7, 'lowpass')
  },
  slice() {
    noiseHit(0.06, 0.35, 5200, 1.4, 'highpass')
    tone({ freq: 2400, to: 1200, dur: 0.3, gain: 0.012, type: 'sine' })
  },
  reveal() {
    tone({ freq: 392, dur: 2, gain: 0.05 })
    tone({ freq: 587.33, dur: 2, gain: 0.035, delay: 0.05 })
    tone({ freq: 783.99, dur: 1.4, gain: 0.02, delay: 0.12 })
  },
}
