import { Images, RotateCcw } from 'lucide-react'
import { RevealWords } from '../components/RevealWords'
import { GoldButton } from '../components/GoldButton'
import { BIRTHDAY } from '../config'
import { replay, setScene } from '../state/party'
import { sfx } from '../lib/sfx'

export function FinaleScene() {
  return (
    <section className="scene scene--center scene--finale-final" aria-labelledby="finale-title">
      <div className="finale-final">
        <div className="finale-final__halo" aria-hidden="true" />

        <p className="eyebrow eyebrow--center fade-up">The Grand Finale</p>

        <h2 className="finale-final__title" id="finale-title">
          <RevealWords text={`HAPPY ${BIRTHDAY.age}TH BIRTHDAY`} />
          <RevealWords
            text={BIRTHDAY.name.toUpperCase()}
            className="heading--gold"
            delay={0.45}
          />
        </h2>

        <p className="finale-final__sub fade-up" style={{ animationDelay: '0.9s' }}>
          {BIRTHDAY.finaleSubtitle}
        </p>

        <div className="finale-final__number fade-up" style={{ animationDelay: '1s' }}>
          <span className="finale-final__number-ring" aria-hidden="true" />
          <span className="finale-final__number-ring finale-final__number-ring--inner" aria-hidden="true" />
          <span className="finale-final__digits" aria-label={`${BIRTHDAY.age} years`}>
            {BIRTHDAY.age}
          </span>
          <span className="finale-final__star finale-final__star--one" aria-hidden="true" />
          <span className="finale-final__star finale-final__star--two" aria-hidden="true" />
          <span className="finale-final__star finale-final__star--three" aria-hidden="true" />
        </div>

        <p className="finale-final__note fade-up" style={{ animationDelay: '1.15s' }}>
          {BIRTHDAY.finaleNote}
        </p>

        <div className="finale-final__actions fade-up" style={{ animationDelay: '1.3s' }}>
          <GoldButton
            variant="primary"
            onClick={() => {
              sfx.enter()
              replay()
            }}
            icon={<RotateCcw size={14} strokeWidth={1.4} />}
          >
            Relive the Celebration
          </GoldButton>
          <GoldButton
            variant="ghost"
            onClick={() => {
              sfx.chime(659.25)
              setScene(5)
            }}
            icon={<Images size={14} strokeWidth={1.4} />}
          >
            View Our Memories
          </GoldButton>
        </div>

        <p className="finale-final__sign fade-up" style={{ animationDelay: '1.45s' }}>
          {BIRTHDAY.firstName} · {BIRTHDAY.age} years of light
        </p>
      </div>
    </section>
  )
}
