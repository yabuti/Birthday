import { SCENES, setScene, useParty, isActivityDone } from '../state/party'
import { sfx } from '../lib/sfx'

export function ProgressRail() {
  const { scene } = useParty()
  const progress = SCENES.length > 1 ? (scene / (SCENES.length - 1)) * 100 : 0

  const handleSelect = (index: number) => {
    sfx.chime(587.33)
    setScene(index)
  }

  return (
    <nav className="rail" aria-label="Celebration progress">
      <ol>
        <span className="rail__fill" style={{ height: `${progress}%` }} aria-hidden="true" />
        {SCENES.map((entry, index) => {
          const isDone = isActivityDone(index)
          const isCurrent = index === scene

          return (
            <li key={entry.id}>
              <button
                type="button"
                onClick={() => handleSelect(index)}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`${entry.label}`}
                title={entry.label}
              >
                <span className="rail__label">
                  {entry.numeral} · {entry.label}
                  {isDone && index > 0 && index < 5 ? ' ✨' : ''}
                </span>
                <span className={`rail__dot${isDone ? ' is-done' : ''}`} />
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
