import { useCallback, useEffect, useRef, useState } from 'react'

export type MicStatus = 'idle' | 'requesting' | 'listening' | 'denied' | 'unsupported'

type AudioWindow = Window & { webkitAudioContext?: typeof AudioContext }

/**
 * Listens to microphone volume and fires once when the guest blows at it.
 * The stream, track and audio context are always released on stop/unmount.
 */
export function useBlowDetection(onBlow: () => void) {
  const [status, setStatus] = useState<MicStatus>('idle')
  const [level, setLevel] = useState(0)
  const streamRef = useRef<MediaStream | null>(null)
  const contextRef = useRef<AudioContext | null>(null)
  const frameRef = useRef<number | null>(null)
  const onBlowRef = useRef(onBlow)
  onBlowRef.current = onBlow

  const stop = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    frameRef.current = null
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (contextRef.current) {
      void contextRef.current.close().catch(() => undefined)
      contextRef.current = null
    }
    setLevel(0)
    setStatus('idle')
  }, [])

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('unsupported')
      return
    }
    setStatus('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: false,
          autoGainControl: false,
        },
      })
      const Ctor = window.AudioContext ?? (window as AudioWindow).webkitAudioContext
      if (!Ctor) {
        stream.getTracks().forEach((track) => track.stop())
        setStatus('unsupported')
        return
      }

      const audioContext = new Ctor()
      await audioContext.resume()
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 512
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)

      streamRef.current = stream
      contextRef.current = audioContext
      setStatus('listening')

      const data = new Uint8Array(analyser.fftSize)
      let loudFrames = 0

      const tick = () => {
        analyser.getByteTimeDomainData(data)
        let sum = 0
        for (let i = 0; i < data.length; i += 1) {
          const value = (data[i] - 128) / 128
          sum += value * value
        }
        const rms = Math.sqrt(sum / data.length)
        setLevel(Math.min(1, rms * 9))

        if (rms > 0.08) loudFrames += 1
        else loudFrames = Math.max(0, loudFrames - 2)

        if (loudFrames > 14) {
          onBlowRef.current()
          stop()
          return
        }
        frameRef.current = requestAnimationFrame(tick)
      }

      frameRef.current = requestAnimationFrame(tick)
    } catch {
      setStatus('denied')
    }
  }, [stop])

  useEffect(() => stop, [stop])

  return { status, level, start, stop }
}
