import { Heart, Sparkles, Star, Sun } from 'lucide-react'
import { BIRTHDAY } from '../config'

export function WishesStory() {
  const cards = [
    {
      icon: <Sun size={20} className="wish-card__icon wish-card__icon--gold" />,
      title: 'Your Radiant Smile',
      text: 'The kind of smile that brightens any room, melts away worries, and makes everyone around you feel cherished.',
    },
    {
      icon: <Heart size={20} className="wish-card__icon wish-card__icon--blue" />,
      title: 'Your Beautiful Heart',
      text: 'Thoughtful, compassionate, and full of quiet grace. You bring genuine warmth everywhere you go.',
    },
    {
      icon: <Star size={20} className="wish-card__icon wish-card__icon--gold" />,
      title: 'Your Golden Chapter',
      text: 'May twenty-five open doors to your boldest dreams, deep peace, boundless love, and unforgettable laughter.',
    },
  ]

  return (
    <section className="story-section story-section--wishes" id="wishes">
      <div className="story-section__header">
        <span className="story-eyebrow">
          <Sparkles size={11} />
          <span>Chapter I · Golden Twenty-Five</span>
          <Sparkles size={11} />
        </span>
        <h2 className="story-section__title">25 Years of Light & Beauty</h2>
        <p className="story-section__sub">
          A quarter century of grace, laughter, and making the world a sweeter place.
        </p>
      </div>

      <div className="wishes-number">
        <span className="wishes-number__ring" aria-hidden="true" />
        <span className="wishes-number__digits">{BIRTHDAY.age}</span>
        <span className="wishes-number__label">Golden Years</span>
      </div>

      <div className="wishes-grid">
        {cards.map((c, i) => (
          <div key={i} className="wish-card">
            <div className="wish-card__icon-box">{c.icon}</div>
            <h3 className="wish-card__title">{c.title}</h3>
            <p className="wish-card__text">{c.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
