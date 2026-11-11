import { useState } from 'react'
import { Flame, Sparkles, Wind } from 'lucide-react'
import { BIRTHDAY } from '../config'
import { sfx } from '../lib/sfx'

export function CakeStory() {
  const [litCandles, setLitCandles] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7])
  const [wishMade, setWishMade] = useState(false)

  const toggleCandle = (idx: number) => {
    if (litCandles.includes(idx)) {
      sfx.whoosh()
      setLitCandles(litCandles.filter((i) => i !== idx))
    } else {
      sfx.sparkle()
      setLitCandles([...litCandles, idx])
    }
  }

  const handleLightAll = () => {
    sfx.sparkle()
    setLitCandles([0, 1, 2, 3, 4, 5, 6, 7])
    setWishMade(false)
  }

  const handleBlowOut = () => {
    sfx.whoosh()
    setLitCandles([])
    setWishMade(true)
    sfx.reveal()
  }

  return (
    <section className="story-section story-section--cake" id="cake">
      <div className="story-section__header">
        <span className="story-eyebrow">
          <Sparkles size={11} />
          <span>Chapter II · The Birthday Wish</span>
          <Sparkles size={11} />
        </span>
        <h2 className="story-section__title">Make a Wish, {BIRTHDAY.firstName}</h2>
        <p className="story-section__sub">
          Eight little flames for twenty-five golden years. Tap the candles or click blow to make your wish.
        </p>
      </div>

      <div className="story-cake-stage">
        {/* Visual Cake Graphic */}
        <div className="story-cake">
          <div className="story-cake__candles">
            {Array.from({ length: 8 }).map((_, i) => {
              const isLit = litCandles.includes(i)
              return (
                <button
                  key={i}
                  type="button"
                  className={`story-candle${isLit ? ' is-lit' : ''}`}
                  onClick={() => toggleCandle(i)}
                  aria-label={`Candle ${i + 1}, ${isLit ? 'burning' : 'extinguished'}`}
                >
                  <span className="story-candle__flame" />
                  <span className="story-candle__stick" />
                </button>
              )
            })}
          </div>

          <div className="story-cake__tier story-cake__tier--top">
            <span className="story-cake__icing" />
            <span className="story-cake__badge">25</span>
          </div>
          <div className="story-cake__tier story-cake__tier--base">
            <span className="story-cake__icing" />
            <span className="story-cake__trim" />
          </div>
          <div className="story-cake__stand" />
        </div>

        {wishMade ? (
          <div className="story-cake__wish-granted">
            <Sparkles size={16} />
            <span>✨ Your wish is sent to the stars! Happy 25th! ✨</span>
            <Sparkles size={16} />
          </div>
        ) : null}

        <div className="story-cake__actions">
          <button
            type="button"
            className="story-btn story-btn--primary"
            onClick={handleBlowOut}
            disabled={litCandles.length === 0}
          >
            <Wind size={15} />
            <span>Blow Out the Candles & Make a Wish</span>
          </button>

          {litCandles.length < 8 ? (
            <button
              type="button"
              className="story-btn story-btn--outline"
              onClick={handleLightAll}
            >
              <Flame size={15} />
              <span>Relight Candles</span>
            </button>
          ) : null}
        </div>
      </div>
    </section>
  )
}
