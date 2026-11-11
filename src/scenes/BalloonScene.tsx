import { AnimatePresence, motion } from 'framer-motion'
import { PartyPopper, Sparkles, X } from 'lucide-react'
import { RevealWords } from '../components/RevealWords'
import { GoldButton } from '../components/GoldButton'
import {
  POP_GOAL,
  clearBalloonNote,
  popBalloon,
  useParty,
} from '../state/party'
import { BALLOONS, NOTE_BALLOONS } from '../data/balloons'

const RADIUS = 20
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const TOTAL = BALLOONS.length

export function BalloonScene() {
  const { popped, lastMessage } = useParty()
  const count = popped.length
  const progress = count / TOTAL
  const notesFound = NOTE_BALLOONS.filter((balloon) => popped.includes(balloon.id)).length
  const confettiReady = count >= POP_GOAL

  const handlePopOne = () => {
    const remaining = BALLOONS.filter((balloon) => !popped.includes(balloon.id))
    if (!remaining.length) return
    const pick = remaining[Math.floor(Math.random() * remaining.length)]
    popBalloon(pick.id, pick.message)
  }

  return (
    <section className="scene scene--balloons" aria-labelledby="balloons-title">
      <div className="panel">
        <p className="eyebrow">Scene IV · Balloons</p>
        <h2 className="scene__title" id="balloons-title">
          <RevealWords text="Pop into the party." />
        </h2>
        <p className="copy">
          Thirty balloons, every one of them yours to pop. Five are hiding a note written just for
          you; the rest are pure confetti. Tap any balloon that catches your eye.
        </p>

        <div className="pop-meter">
          <div className="pop-meter__ring" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r={RADIUS} stroke="rgba(253,246,239,0.16)" strokeWidth="1" />
              <circle
                cx="24"
                cy="24"
                r={RADIUS}
                stroke="url(#popGrad)"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
                style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.22,1,0.36,1)' }}
              />
              <defs>
                <linearGradient id="popGrad" x1="0" y1="0" x2="48" y2="48">
                  <stop stopColor="#f9e7be" />
                  <stop offset="0.55" stopColor="#d7ab66" />
                  <stop offset="1" stopColor="#e39aae" />
                </linearGradient>
              </defs>
            </svg>
            <span className="pop-meter__num" aria-live="polite">
              {count}
            </span>
          </div>
          <span className="pop-meter__copy">
            <b>
              {count} of {TOTAL} balloons popped
            </b>
            {notesFound} of {NOTE_BALLOONS.length} hidden notes found
          </span>
        </div>

        <div aria-live="polite">
          <AnimatePresence initial={false}>
            {lastMessage ? (
              <motion.div
                key={lastMessage.id}
                className="balloon-note"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="balloon-note__label">
                  <Sparkles size={12} strokeWidth={1.5} />
                  A hidden note
                </span>
                <p>{lastMessage.text}</p>
                <button
                  type="button"
                  className="balloon-note__close"
                  onClick={clearBalloonNote}
                  aria-label="Close the hidden note"
                >
                  <X size={12} strokeWidth={1.5} />
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="panel__actions">
          <GoldButton
            variant="ghost"
            onClick={handlePopOne}
            disabled={count >= TOTAL}
            icon={<PartyPopper size={14} strokeWidth={1.5} />}
          >
            Pop one for me
          </GoldButton>
        </div>

        {confettiReady ? (
          <p className="panel__note fade-up">
            <Sparkles size={14} strokeWidth={1.5} />
            The room is officially full of confetti.
          </p>
        ) : null}
      </div>
    </section>
  )
}
