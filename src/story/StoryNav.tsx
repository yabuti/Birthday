import { MusicPlayer } from '../components/MusicPlayer'
import { BIRTHDAY } from '../config'

export function StoryNav() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="story-nav" aria-label="Celebration sections">
      <div className="story-nav__inner">
        <button
          type="button"
          className="story-nav__brand"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span className="story-nav__mark">Y</span>
          <span className="story-nav__title">{BIRTHDAY.firstName} · 25</span>
        </button>

        <div className="story-nav__links">
          <button type="button" onClick={() => scrollTo('wishes')}>Wishes</button>
          <button type="button" onClick={() => scrollTo('cake')}>Cake</button>
          <button type="button" onClick={() => scrollTo('memories')}>Memories</button>
          <button type="button" onClick={() => scrollTo('balloons')}>Balloons</button>
          <button type="button" onClick={() => scrollTo('letter')}>Letter</button>
          <button type="button" onClick={() => scrollTo('finale')}>Finale</button>
        </div>

        <div className="story-nav__audio">
          <MusicPlayer />
        </div>
      </div>
    </nav>
  )
}
