import { useState } from 'react'
import { Sparkles, Heart } from 'lucide-react'
import { BIRTHDAY } from '../config'
import { sfx } from '../lib/sfx'

export function BalloonsStory() {
  const [popped, setPopped] = useState<number[]>([])
  const [activeMessage, setActiveMessage] = useState<string | null>(null)

  const messages = BIRTHDAY.balloonMessages

  const handlePop = (index: number) => {
    if (popped.includes(index)) return
    sfx.sparkle()
    setPopped([...popped, index])
    setActiveMessage(messages[index] ?? 'Happy 25th Birthday!')
  }

  const colors = [
    { bg: '#fcdfe6', border: '#e89fb1', string: '#d98ca0' },
    { bg: '#faedd2', border: '#e6be75', string: '#d4ab66' },
    { bg: '#f8e0d5', border: '#e3ad9c', string: '#c98a77' },
    { bg: '#f7d6e0', border: '#d887a0', string: '#8e3f55' },
    { bg: '#fff0db', border: '#eec78e', string: '#e5be82' },
  ]

  return (
    <section className="story-section story-section--balloons" id="balloons">
      <div className="story-section__header">
        <span className="story-eyebrow">
          <Sparkles size={11} />
          <span>Chapter IV · Balloons of Joy</span>
          <Sparkles size={11} />
        </span>
        <h2 className="story-section__title">Pop a Balloon for a Message</h2>
        <p className="story-section__sub">
          Each balloon holds a secret wish for you. Tap any balloon to pop it and read what is inside.
        </p>
      </div>

      <div className="story-balloons-cluster">
        {messages.map((msg, index) => {
          const isPopped = popped.includes(index)
          const color = colors[index % colors.length]

          return (
            <div key={index} className="story-balloon-wrapper">
              {!isPopped ? (
                <button
                  type="button"
                  className="story-balloon"
                  style={{
                    backgroundColor: color.bg,
                    borderColor: color.border,
                    animationDelay: `${index * 0.4}s`,
                  }}
                  onClick={() => handlePop(index)}
                  aria-label={`Pop balloon ${index + 1}`}
                >
                  <span className="story-balloon__knot" style={{ backgroundColor: color.border }} />
                  <span className="story-balloon__string" style={{ backgroundColor: color.string }} />
                  <span className="story-balloon__shine" />
                  <span className="story-balloon__heart">
                    <Heart size={14} fill="currentColor" />
                  </span>
                </button>
              ) : (
                <div className="story-balloon-popped">
                  <span className="story-balloon-popped__burst">✨</span>
                  <p className="story-balloon-popped__text">{msg}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {activeMessage ? (
        <div className="story-balloon-banner">
          <Sparkles size={14} className="story-balloon-banner__icon" />
          <span>{activeMessage}</span>
        </div>
      ) : null}
    </section>
  )
}
