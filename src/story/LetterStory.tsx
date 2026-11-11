import { useState } from 'react'
import { Heart, Sparkles } from 'lucide-react'
import { BIRTHDAY } from '../config'
import { sfx } from '../lib/sfx'

export function LetterStory() {
  const [opened, setOpened] = useState(false)

  const handleOpen = () => {
    sfx.reveal()
    setOpened(true)
  }

  const { letter } = BIRTHDAY

  return (
    <section className="story-section story-section--letter" id="letter">
      <div className="story-section__header">
        <span className="story-eyebrow">
          <Sparkles size={11} />
          <span>Chapter V · A Letter for You</span>
          <Sparkles size={11} />
        </span>
        <h2 className="story-section__title">Words from the Heart</h2>
        <p className="story-section__sub">
          A personal message sealed with love just for your twenty-fifth birthday.
        </p>
      </div>

      <div className="story-envelope-stage">
        {!opened ? (
          <div className="story-envelope" onClick={handleOpen} role="button" tabIndex={0}>
            <div className="story-envelope__body">
              <span className="story-envelope__flap" />
              <div className="story-envelope__seal">
                <span className="story-envelope__wax">
                  <Heart size={16} fill="currentColor" />
                  <span className="story-envelope__wax-text">Y</span>
                </span>
                <span className="story-envelope__seal-prompt">Tap to open letter</span>
              </div>
            </div>
            <p className="story-envelope__to">For My Dearest Yabye</p>
          </div>
        ) : (
          <article className="story-letter-paper">
            <header className="story-letter-paper__header">
              <span className="story-letter-paper__date">November 2026</span>
              <h3 className="story-letter-paper__salutation">{letter.salutation}</h3>
            </header>

            <div className="story-letter-paper__content">
              {letter.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <footer className="story-letter-paper__footer">
              <p className="story-letter-paper__closing">{letter.closing}</p>
              <span className="story-letter-paper__signature">Forever & Always</span>
            </footer>
          </article>
        )}
      </div>
    </section>
  )
}
