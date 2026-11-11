import { Sparkles, RotateCcw, Heart } from 'lucide-react'
import { BIRTHDAY } from '../config'
import { sfx } from '../lib/sfx'

interface FinaleStoryProps {
  onScrollToTop: () => void
}

export function FinaleStory({ onScrollToTop }: FinaleStoryProps) {
  const handleReplay = () => {
    sfx.enter()
    onScrollToTop()
  }

  return (
    <footer className="story-section story-section--finale" id="finale">
      <div className="story-finale__halo" aria-hidden="true" />

      <div className="story-finale__content">
        <span className="story-eyebrow">
          <Sparkles size={11} />
          <span>The Grand Finale</span>
          <Sparkles size={11} />
        </span>

        <h2 className="story-finale__title">
          HAPPY 25TH BIRTHDAY
          <span className="story-finale__name">{BIRTHDAY.name.toUpperCase()}</span>
        </h2>

        <p className="story-finale__sub">
          {BIRTHDAY.finaleSubtitle}
        </p>

        <div className="story-finale__number">
          <span className="story-finale__digits">{BIRTHDAY.age}</span>
          <span className="story-finale__years">Years of Light</span>
        </div>

        <p className="story-finale__note">
          {BIRTHDAY.finaleNote}
        </p>

        <div className="story-finale__actions">
          <button
            type="button"
            className="story-btn story-btn--primary"
            onClick={handleReplay}
          >
            <RotateCcw size={15} />
            <span>Relive the Celebration from the Top</span>
          </button>
        </div>

        <div className="story-finale__signature">
          <Heart size={12} fill="currentColor" className="story-finale__heart" />
          <span>Created with all my heart for Yabye · Golden 25</span>
        </div>
      </div>
    </footer>
  )
}
