import { useEffect, useRef, useState, type CSSProperties, type ChangeEvent } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ImagePlus, Sparkles, X } from 'lucide-react'
import { RevealWords } from '../components/RevealWords'
import { MemoryPhoto } from '../components/MemoryPhoto'
import { BIRTHDAY } from '../config'
import { sfx } from '../lib/sfx'
import { setSessionPhoto } from '../lib/images'

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]
const TILTS = [-2.6, 1.9, -1.4, 2.4, -2.1, 1.2, -0.8, 2.8, -2.3, 1.6, -1.9, 2.2, -1.1, 2.6, -2.4]
const PHOTOS = BIRTHDAY.photos

export function MemoriesScene() {
  const [viewer, setViewer] = useState<number | null>(null)
  const [sessionCount, setSessionCount] = useState(0)
  const isOpen = viewer !== null
  const active = viewer === null ? null : PHOTOS[viewer]
  const closeRef = useRef<HTMLButtonElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const open = (index: number) => {
    sfx.chime(783.99)
    setViewer(index)
  }

  const close = () => setViewer(null)

  const step = (delta: number) => {
    setViewer((current) =>
      current === null ? null : (current + delta + PHOTOS.length) % PHOTOS.length,
    )
    sfx.chime(587.33)
  }

  const handleUploadPhotos = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    sfx.sparkle()

    Array.from(files).forEach((file, i) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Store by index and by photo id
          const targetIndex = (sessionCount + i) % PHOTOS.length
          const photoId = PHOTOS[targetIndex]?.id
          setSessionPhoto(String(targetIndex), reader.result)
          if (photoId) {
            setSessionPhoto(photoId, reader.result)
          }
        }
      }
      reader.readAsDataURL(file)
    })
    setSessionCount((prev) => prev + files.length)
    e.target.value = ''
  }

  useEffect(() => {
    if (isOpen) closeRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setViewer(null)
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        setViewer((current) =>
          current === null ? current : (current + 1) % PHOTOS.length,
        )
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setViewer((current) =>
          current === null ? current : (current - 1 + PHOTOS.length) % PHOTOS.length,
        )
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  return (
    <section className="scene scene--album" aria-labelledby="memories-title">
      <div className="album">
        <div className="album__decor" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, index) => (
            <span key={index} />
          ))}
        </div>

        <header className="album__head">
          <p className="eyebrow eyebrow--center">Scene VI · Moments in Time</p>
          <h2 className="album__title" id="memories-title">
            <RevealWords text={`25 Years of Beautiful Memories`} />
          </h2>
          <p className="album__sub">
            Cherished frames from your story. Tap any photo to see it up close.
          </p>

          <div className="album__uploader-bar">
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleUploadPhotos}
            />
            <button
              type="button"
              className="album__upload-pill"
              onClick={() => fileInputRef.current?.click()}
              title="Add or preview custom photos in this browser"
            >
              <ImagePlus size={13} strokeWidth={1.6} />
              <span>Select Photos from Device</span>
            </button>
            <span className="album__upload-hint">
              (Or place files in <code>public/photos/</code>)
            </span>
          </div>
        </header>

        <div className="album__wall">
          {PHOTOS.map((photo, index) => {
            const cardStyle = {
              '--tilt': `${TILTS[index] ?? 0}deg`,
              '--float-delay': `${(index % 6) * 0.65}s`,
              '--float-duration': `${6.4 + (index % 5) * 0.8}s`,
            } as unknown as CSSProperties

            return (
              <motion.button
                key={photo.id}
                type="button"
                className="polaroid"
                onClick={() => open(index)}
                aria-label={`Open photograph ${index + 1}: ${photo.title}`}
                initial={{ opacity: 0, y: 28, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.75, delay: 0.1 + index * 0.045, ease }}
              >
                <span className="polaroid__card" style={cardStyle}>
                  <span className="polaroid__tape" aria-hidden="true" />
                  <span className="polaroid__photo">
                    <MemoryPhoto photo={photo} index={index} />
                  </span>
                  <span className="polaroid__caption">
                    <span className="polaroid__title">{photo.title}</span>
                    <span className="polaroid__date">{photo.date}</span>
                  </span>
                </span>
              </motion.button>
            )
          })}
        </div>

        <p className="album__hint">
          <Sparkles size={12} strokeWidth={1.5} />
          {PHOTOS.length} photographs from your journey · Tap to view full size
        </p>
      </div>

      {createPortal(
        <AnimatePresence>
          {active ? (
            <motion.div
              key="viewer"
              className="memory-viewer"
              role="dialog"
              aria-modal="true"
              aria-label={`${active.title}, photograph ${(viewer ?? 0) + 1} of ${PHOTOS.length}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                type="button"
                className="memory-viewer__scrim"
                onClick={close}
                aria-label="Close the photograph viewer"
                tabIndex={-1}
              />

              <motion.div
                className="memory-viewer__stage"
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
                transition={{ duration: 0.45, ease }}
              >
                <button
                  ref={closeRef}
                  type="button"
                  className="memory-viewer__close"
                  onClick={close}
                  aria-label="Close photograph viewer"
                >
                  <X size={17} strokeWidth={1.4} />
                </button>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.figure
                    key={active.id}
                    className="memory-viewer__figure"
                    initial={{ opacity: 0, x: 18, rotate: -0.8 }}
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    exit={{ opacity: 0, x: -18, rotate: 0.8 }}
                    transition={{ duration: 0.38, ease }}
                  >
                    <div className="memory-viewer__photo">
                      <MemoryPhoto photo={active} index={viewer ?? 0} />
                    </div>
                    <figcaption className="memory-viewer__copy">
                      <span className="memory-viewer__date">{active.date}</span>
                      <h3>{active.title}</h3>
                      <p className="memory-viewer__caption">{active.caption}</p>
                      <p className="memory-viewer__description">{active.description}</p>
                    </figcaption>
                  </motion.figure>
                </AnimatePresence>

                <div className="memory-viewer__nav">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous photograph"
                  >
                    <ChevronLeft size={18} strokeWidth={1.4} />
                  </button>
                  <span aria-live="polite">
                    {String((viewer ?? 0) + 1).padStart(2, '0')} <i />{' '}
                    {String(PHOTOS.length).padStart(2, '0')}
                  </span>
                  <button type="button" onClick={() => step(1)} aria-label="Next photograph">
                    <ChevronRight size={18} strokeWidth={1.4} />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  )
}
