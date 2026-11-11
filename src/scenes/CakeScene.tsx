import { useEffect } from 'react'
import { Flame, Mic, RotateCcw, Sparkles, Wind } from 'lucide-react'
import { RevealWords } from '../components/RevealWords'
import { GoldButton } from '../components/GoldButton'
import {
  CANDLE_COUNT,
  blowOutCandles,
  lightAllCandles,
  resetCake,
  useParty,
} from '../state/party'
import { BIRTHDAY } from '../config'
import { useBlowDetection } from '../lib/useBlow'
import { sfx } from '../lib/sfx'

export function CakeScene() {
  const { litCandles, wishMade } = useParty()
  const lit = litCandles.length
  const { status, level, start, stop } = useBlowDetection(() => {
    sfx.whoosh()
    blowOutCandles()
  })

  useEffect(() => {
    if (wishMade) stop()
  }, [wishMade, stop])

  return (
    <section className="scene scene--cake" aria-labelledby="cake-title">
      <div className="panel">
        <p className="eyebrow">Scene II · The Cake</p>
        <h2 className="scene__title" id="cake-title">
          <RevealWords text={`Make a wish, ${BIRTHDAY.firstName}.`} />
        </h2>
        <p className="copy">
          Eight little flames for twenty-five golden years. Tap a candle on the cake to light it —
          or light them all at once — then close your eyes and wish.
        </p>

        <div className="candle-meter">
          <div className="candle-meter__track" role="presentation">
            <span
              className="candle-meter__fill"
              style={{ width: `${(lit / CANDLE_COUNT) * 100}%` }}
            />
          </div>
          <span className="candle-meter__label" aria-live="polite">
            {lit} / {CANDLE_COUNT} lit
          </span>
        </div>

        <div className="panel__actions">
          <GoldButton
            onClick={() => {
              sfx.sparkle()
              lightAllCandles()
            }}
            disabled={lit === CANDLE_COUNT}
            icon={<Flame size={14} strokeWidth={1.5} />}
          >
            Light every candle
          </GoldButton>
          <GoldButton
            variant="ghost"
            onClick={() => {
              sfx.whoosh()
              blowOutCandles()
            }}
            disabled={lit === 0 || wishMade}
            icon={<Wind size={14} strokeWidth={1.5} />}
          >
            Blow out the candles
          </GoldButton>
        </div>

        <div className="panel__actions">
          <GoldButton
            variant="ghost"
            onClick={() => {
              if (status === 'listening') stop()
              else void start()
            }}
            disabled={lit === 0 || wishMade || status === 'requesting'}
            icon={<Mic size={14} strokeWidth={1.5} />}
          >
            {status === 'listening' ? 'Stop listening' : 'Blow with your mic'}
          </GoldButton>

          {wishMade ? (
            <GoldButton
              variant="ghost"
              onClick={() => {
                sfx.chime(523.25)
                resetCake()
              }}
              icon={<RotateCcw size={14} strokeWidth={1.5} />}
            >
              Relight the cake
            </GoldButton>
          ) : null}
        </div>

        {status === 'listening' ? (
          <div className="mic-meter">
            <span className="mic-meter__track" aria-hidden="true">
              <span className="mic-meter__fill" style={{ width: `${Math.round(level * 100)}%` }} />
            </span>
            <em>Now blow gently toward your microphone</em>
          </div>
        ) : null}

        {status === 'requesting' ? (
          <p className="panel__note">Waiting for microphone permission…</p>
        ) : null}

        {status === 'denied' ? (
          <p className="panel__note mic-note">
            Microphone access was declined — the candle button works just as well.
          </p>
        ) : null}

        {status === 'unsupported' ? (
          <p className="panel__note mic-note">
            This browser cannot listen to a microphone. Use the candle button instead.
          </p>
        ) : null}

        {wishMade ? (
          <p className="panel__note fade-up">
            <Sparkles size={14} strokeWidth={1.5} />
            The candles are out. Your wish is already on its way.
          </p>
        ) : null}
      </div>
    </section>
  )
}
