import { useState } from 'react'
import { Sparkles, X, ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { BIRTHDAY } from '../config'
import { MemoryPhoto } from '../components/MemoryPhoto'
import { sfx } from '../lib/sfx'

export function MemoriesStory() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const photos = BIRTHDAY.photos.slice(0, 6) // Highlight her 6 real photos prominently

  const openPhoto = (idx: number) => {
    sfx.chime(783.99)
    setActiveIdx(idx)
  }

  const closePhoto = () => setActiveIdx(null)

  const step = (delta: number) => {
    if (activeIdx === null) return
    setActiveIdx((activeIdx + delta + photos.length) % photos.length)
    sfx.chime(587.33)
  }

  const activePhoto = activeIdx !== null ? photos[activeIdx] : null

  return (
    <section className="story-section story-section--memories" id="memories">
      <div className="story-section__header">
        <span className="story-eyebrow">
          <Sparkles size={11} />
          <span>Chapter III · Cherished Moments</span>
          <Sparkles size={11} />
        </span>
        <h2 className="story-section__title">Our Beautiful Memories</h2>
        <p className="story-section__sub">
          Snapshots of joy, laughter, and grace. Tap any photo to view it up close.
        </p>
      </div>

      <div className="story-gallery">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            className="story-photo-card"
            onClick={() => openPhoto(index)}
            aria-label={`Open photo: ${photo.title}`}
          >
            <div className="story-photo-card__frame">
              <span className="story-photo-card__tape" aria-hidden="true" />
              <div className="story-photo-card__image-box">
                <MemoryPhoto photo={photo} index={index} />
              </div>
              <div className="story-photo-card__caption">
                <span className="story-photo-card__title">{photo.title}</span>
                <span className="story-photo-card__date">{photo.date}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && activeIdx !== null ? (
        <div className="story-lightbox" role="dialog" aria-modal="true">
          <div className="story-lightbox__backdrop" onClick={closePhoto} />
          
          <div className="story-lightbox__card">
            <button
              type="button"
              className="story-lightbox__close"
              onClick={closePhoto}
              aria-label="Close photo"
            >
              <X size={20} />
            </button>

            <div className="story-lightbox__image-wrap">
              <MemoryPhoto photo={activePhoto} index={activeIdx} />
            </div>

            <div className="story-lightbox__info">
              <span className="story-lightbox__date">{activePhoto.date}</span>
              <h3 className="story-lightbox__title">{activePhoto.title}</h3>
              <p className="story-lightbox__desc">{activePhoto.description}</p>
              <div className="story-lightbox__tag">
                <Heart size={12} fill="currentColor" />
                <span>Yabye · Golden 25</span>
              </div>
            </div>

            <div className="story-lightbox__nav">
              <button
                type="button"
                className="story-lightbox__nav-btn"
                onClick={() => step(-1)}
                aria-label="Previous photo"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="story-lightbox__counter">
                {activeIdx + 1} / {photos.length}
              </span>
              <button
                type="button"
                className="story-lightbox__nav-btn"
                onClick={() => step(1)}
                aria-label="Next photo"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
