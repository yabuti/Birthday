import { useEffect, useRef, useState, type ChangeEvent, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Music2,
  Pause,
  Play,
  Sparkles,
  Upload,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react'
import {
  initMusic,
  loadMusicFile,
  pauseMusic,
  playMusic,
  setVolume,
  toggleMuted,
  useMusic,
} from '../lib/music'
import { toggleAudio, useParty } from '../state/party'
import { sfx } from '../lib/sfx'
import { BIRTHDAY } from '../config'

export function MusicPlayer() {
  const { playing, muted, volume, track, uploaded } = useMusic()
  const { audio } = useParty()
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    initMusic(BIRTHDAY.music.src, BIRTHDAY.music.title)
  }, [])

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return
      setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('pointerdown', onPointer)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    sfx.sparkle()
    await loadMusicFile(file)
    event.target.value = ''
  }

  const togglePlayback = () => {
    if (playing) {
      pauseMusic()
    } else {
      sfx.chime(659.25)
      void playMusic()
    }
  }

  const volumeStyle = {
    '--fill': `${Math.round((muted ? 0 : volume) * 100)}%`,
  } as unknown as CSSProperties

  return (
    <div className="player">
      <button
        ref={triggerRef}
        type="button"
        className={`player__trigger${playing ? ' is-playing' : ''}`}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? 'Close the music player' : 'Open the music player'}
        title="Birthday music"
      >
        <Music2 size={15} strokeWidth={1.5} />
        <span className="player__trigger-label">{playing ? 'Playing' : 'Music'}</span>
        <span className="player__pulse" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={panelRef}
            className="player__panel"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="player__head">
              <span className="player__eyebrow">{playing ? 'Now playing' : 'Birthday music'}</span>
              <span className="player__track" title={track}>
                {track}
              </span>
            </div>

            <div className="player__controls">
              <button
                type="button"
                className="player__play"
                onClick={togglePlayback}
                aria-label={playing ? 'Pause the music' : 'Play the music'}
              >
                {playing ? (
                  <Pause size={16} strokeWidth={1.6} />
                ) : (
                  <Play size={16} strokeWidth={1.6} />
                )}
              </button>

              <button
                type="button"
                className="player__icon"
                onClick={toggleMuted}
                aria-label={muted ? 'Unmute the music' : 'Mute the music'}
                aria-pressed={muted}
              >
                {muted ? (
                  <VolumeX size={15} strokeWidth={1.5} />
                ) : (
                  <Volume2 size={15} strokeWidth={1.5} />
                )}
              </button>

              <div className="player__volume">
                <Volume1 size={14} strokeWidth={1.5} />
                <input
                  style={volumeStyle}
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={muted ? 0 : volume}
                  onChange={(event) => setVolume(Number(event.target.value))}
                  aria-label="Music volume"
                />
              </div>
            </div>

            <div className="player__row">
              <button
                type="button"
                className="player__upload"
                onClick={() => inputRef.current?.click()}
              >
                <Upload size={13} strokeWidth={1.5} />
                Upload music
              </button>
              <input
                ref={inputRef}
                className="sr-only"
                type="file"
                accept="audio/*"
                onChange={handleFile}
                aria-label="Upload your own birthday music"
              />
              <span className="player__note">
                {uploaded ? 'Your track · loops across scenes' : 'Music box · loops across scenes'}
              </span>
            </div>

            <label className="player__sfx">
              <input type="checkbox" checked={audio} onChange={toggleAudio} />
              <span>Interaction chimes</span>
              <Sparkles size={12} strokeWidth={1.4} />
            </label>

            <p className="player__hint">
              Nothing plays until you press play. The music keeps going as you move through the
              party.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
