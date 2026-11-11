import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Feather, RotateCcw } from 'lucide-react'
import { RevealWords } from '../components/RevealWords'
import { BIRTHDAY } from '../config'
import { openLetter, resetLetter, useParty } from '../state/party'
import { sfx } from '../lib/sfx'

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

type LetterBlock = {
  kind: 'salutation' | 'p' | 'emphasis' | 'closing'
  text: string
  start: number
}

const BLOCKS: LetterBlock[] = (() => {
  const raw: Array<{ kind: LetterBlock['kind']; text: string }> = [
    { kind: 'salutation', text: BIRTHDAY.letter.salutation },
    ...BIRTHDAY.letter.paragraphs.map((text, index) => ({
      kind:
        index === BIRTHDAY.letter.paragraphs.length - 1
          ? ('emphasis' as const)
          : ('p' as const),
      text,
    })),
    { kind: 'closing', text: BIRTHDAY.letter.closing },
  ]

  let cursor = 0
  return raw.map((block) => {
    const start = cursor
    cursor += block.text.length
    return { ...block, start }
  })
})()

const FULL_LENGTH = BLOCKS.reduce((sum, block) => sum + block.text.length, 0)

type Phase = 'sealed' | 'breaking' | 'open'

export function LetterScene() {
  const { letterOpen } = useParty()
  const [phase, setPhase] = useState<Phase>(letterOpen ? 'open' : 'sealed')
  const [typed, setTyped] = useState(letterOpen ? FULL_LENGTH : 0)
  const [typing, setTyping] = useState(false)
  const timers = useRef<number[]>([])
  const paperRef = useRef<HTMLElement>(null)

  const schedule = (callback: () => void, delay: number) => {
    timers.current.push(window.setTimeout(callback, delay))
  }

  useEffect(
    () => () => {
      timers.current.forEach((timer) => window.clearTimeout(timer))
      timers.current = []
    },
    [],
  )

  useEffect(() => {
    if (!typing) return
    const interval = window.setInterval(() => {
      setTyped((value) => Math.min(FULL_LENGTH, value + 2))
    }, 24)
    return () => window.clearInterval(interval)
  }, [typing])

  useEffect(() => {
    if (typing && typed >= FULL_LENGTH) setTyping(false)
  }, [typed, typing])

  useEffect(() => {
    if (!typing) return
    const paper = paperRef.current
    if (paper) paper.scrollTop = paper.scrollHeight
  }, [typed, typing])

  const openEnvelope = () => {
    if (phase !== 'sealed') return
    setPhase('breaking')
    setTyped(0)
    setTyping(false)
    sfx.whoosh()
    schedule(() => {
      setPhase('open')
      openLetter()
      sfx.reveal()
    }, 1000)
    schedule(() => setTyping(true), 1900)
  }

  const readWholeLetter = () => {
    setTyped(FULL_LENGTH)
    setTyping(false)
    sfx.chime(880)
  }

  const replayLetter = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current = []
    setPhase('sealed')
    setTyped(0)
    setTyping(false)
    resetLetter()
    sfx.whoosh()
  }

  return (
    <section className="scene scene--letter" aria-labelledby="letter-title">
      <div className="letter-scene">
        <header className="letter-scene__head">
          <p className="eyebrow eyebrow--center">Scene VII · The Letter</p>
          <h2 id="letter-title">
            <RevealWords text="A letter for you." />
          </h2>
        </header>

        {phase !== 'open' ? (
          <div className="envelope-wrap fade-up">
            <p className="letter-scene__prompt">{BIRTHDAY.letter.prompt}</p>

            <button
              type="button"
              className={`envelope${phase === 'breaking' ? ' is-breaking' : ''}`}
              onClick={openEnvelope}
              aria-label="Break the wax seal and open the letter"
            >
              <span className="envelope__back" aria-hidden="true" />
              <span className="envelope__slip" aria-hidden="true" />
              <span className="envelope__front" aria-hidden="true" />
              <span className="envelope__flap" aria-hidden="true" />

              <svg className="envelope__flower envelope__flower--left" viewBox="0 0 44 44" aria-hidden="true">
                <g fill="none" stroke="currentColor" strokeWidth="0.9">
                  <circle cx="18" cy="16" r="2.4" />
                  <circle cx="13" cy="21" r="2.4" />
                  <circle cx="23" cy="21" r="2.4" />
                  <circle cx="18" cy="25" r="2.4" />
                  <circle cx="18" cy="20.5" r="1.6" />
                  <path d="M18 27c-3 5-5 9-4 14" />
                  <path d="M18 32c3-2 5-2 7-1" />
                </g>
              </svg>
              <svg className="envelope__flower envelope__flower--right" viewBox="0 0 44 44" aria-hidden="true">
                <g fill="none" stroke="currentColor" strokeWidth="0.9">
                  <circle cx="26" cy="14" r="2" />
                  <circle cx="21" cy="18" r="2" />
                  <circle cx="31" cy="18" r="2" />
                  <circle cx="26" cy="22" r="2" />
                  <circle cx="26" cy="18" r="1.3" />
                  <path d="M26 24c2 5 3 10 1 15" />
                  <path d="M26 30c-3-1-5-1-7 0" />
                </g>
              </svg>

              <span className="envelope__glitter" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
              </span>

              <span className="wax-seal" aria-hidden="true">
                <span className="wax-seal__half wax-seal__half--left" />
                <span className="wax-seal__half wax-seal__half--right" />
                <span className="wax-seal__letter">Y</span>
                <span className="wax-seal__crack" />
              </span>

              <span className="envelope__for" aria-hidden="true">
                For Yeabsera
              </span>
            </button>

            <span className="envelope__hint">Tap the seal to open</span>
          </div>
        ) : (
          <>
            <motion.article
              ref={paperRef}
              className="letter-paper letter-paper--typed"
              initial={{ opacity: 0, y: 52, rotateX: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              transition={{ duration: 0.85, ease }}
            >
              <span className="letter-paper__monogram">
                Yeabsera · {BIRTHDAY.age === 25 ? 'XXV' : BIRTHDAY.age}
              </span>

              <div aria-hidden="true" className="letter-paper__typed">
                {BLOCKS.map((block, index) => {
                  const visible = block.text.slice(0, Math.max(0, typed - block.start))
                  if (!visible) return null
                  const caretHere =
                    typing &&
                    typed >= block.start &&
                    typed < block.start + block.text.length
                  return (
                    <p key={index} className={`letter-paper__${block.kind}`}>
                      {visible}
                      {caretHere ? <span className="letter-caret" /> : null}
                    </p>
                  )
                })}
              </div>

              <div className="sr-only">
                {BLOCKS.map((block) => block.text).join(' ')}
              </div>

              <div className="letter-paper__rule" />
            </motion.article>

            <div className="letter-toolbar">
              {typing ? (
                <button type="button" className="letter-toolbar__btn" onClick={readWholeLetter}>
                  <Feather size={13} strokeWidth={1.5} />
                  Read the whole letter
                </button>
              ) : (
                <button type="button" className="letter-toolbar__btn" onClick={replayLetter}>
                  <RotateCcw size={13} strokeWidth={1.5} />
                  Replay the letter
                </button>
              )}
            </div>
          </>
        )}

      </div>
    </section>
  )
}
