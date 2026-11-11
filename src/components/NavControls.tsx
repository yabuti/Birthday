import { ChevronLeft, ChevronRight, RotateCcw, Sparkles } from 'lucide-react'
import {
  SCENES,
  gateHint,
  nextScene,
  previousScene,
  replay,
  setScene,
  useParty,
  isActivityDone,
} from '../state/party'
import { sfx } from '../lib/sfx'

export function NavControls() {
  const { scene } = useParty()
  const isLast = scene === SCENES.length - 1
  const hint = gateHint(scene)

  const goNext = () => {
    sfx.chime(659.25)
    nextScene()
  }

  const goPrevious = () => {
    sfx.chime(493.88)
    previousScene()
  }

  const jumpTo = (index: number) => {
    sfx.chime(587.33)
    setScene(index)
  }

  return (
    <nav className="luxury-dock" aria-label="Celebration Journey">
      {hint && scene > 0 && scene < 5 ? (
        <div className="luxury-dock__hint" aria-live="polite">
          <Sparkles size={11} className="luxury-dock__hint-sparkle" />
          <span>{hint}</span>
        </div>
      ) : null}

      <div className="luxury-dock__bar">
        {/* Previous Button */}
        <button
          type="button"
          className="luxury-dock__arrow luxury-dock__arrow--prev"
          onClick={goPrevious}
          disabled={scene === 0}
          aria-label="Previous chapter"
          title="Previous chapter"
        >
          <ChevronLeft size={16} strokeWidth={1.5} />
          <span className="luxury-dock__arrow-label">Prev</span>
        </button>

        <span className="luxury-dock__divider" aria-hidden="true" />

        {/* Scene Chapters */}
        <div className="luxury-dock__chapters">
          {SCENES.map((item, index) => {
            const isActive = index === scene
            const isDone = isActivityDone(index)

            return (
              <button
                key={item.id}
                type="button"
                className={`luxury-dock__pill${isActive ? ' is-active' : ''}${isDone ? ' is-done' : ''}`}
                onClick={() => jumpTo(index)}
                aria-label={`Go to chapter ${item.numeral}: ${item.label}`}
                title={`${item.numeral} · ${item.label}`}
              >
                <span className="luxury-dock__pill-numeral">{item.numeral}</span>
                <span className="luxury-dock__pill-tooltip">{item.label}</span>
                <span className="luxury-dock__pill-dot" />
              </button>
            )
          })}
        </div>

        <span className="luxury-dock__divider" aria-hidden="true" />

        {/* Next / Replay Button */}
        {isLast ? (
          <button
            type="button"
            className="luxury-dock__arrow luxury-dock__arrow--replay"
            onClick={() => {
              sfx.whoosh()
              replay()
            }}
            aria-label="Replay celebration"
            title="Relive celebration from the beginning"
          >
            <RotateCcw size={14} strokeWidth={1.5} />
            <span className="luxury-dock__arrow-label">Replay</span>
          </button>
        ) : (
          <button
            type="button"
            className="luxury-dock__arrow luxury-dock__arrow--next"
            onClick={goNext}
            aria-label="Next chapter"
            title="Next chapter"
          >
            <span className="luxury-dock__arrow-label">Next</span>
            <ChevronRight size={16} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </nav>
  )
}
