import { useEffect } from 'react'
import { FloatingPetals } from './components/FloatingPetals'
import { ClickSparkles } from './components/ClickSparkles'
import { ConfettiCannon } from './components/ConfettiCannon'
import { StoryNav } from './story/StoryNav'
import { HeroStory } from './story/HeroStory'
import { WishesStory } from './story/WishesStory'
import { CakeStory } from './story/CakeStory'
import { MemoriesStory } from './story/MemoriesStory'
import { BalloonsStory } from './story/BalloonsStory'
import { LetterStory } from './story/LetterStory'
import { FinaleStory } from './story/FinaleStory'
import { BIRTHDAY } from './config'
import { initMusic, playMusic, useMusic } from './lib/music'
import { Music, Sparkles } from 'lucide-react'
import { sfx } from './lib/sfx'
import './styles/experience.css'
import './styles/story.css'

export default function App() {
  const { playing } = useMusic()

  useEffect(() => {
    document.title = `${BIRTHDAY.firstName} · Happy 25th Birthday!`
    initMusic(BIRTHDAY.music.src, BIRTHDAY.music.title)

    // Attempt autoplay immediately on page load
    void playMusic().catch(() => {})

    // Guarantee audio starts on ANY first user touch, tap, scroll or click
    const handleFirstInteraction = () => {
      void playMusic()
      cleanup()
    }

    const cleanup = () => {
      window.removeEventListener('pointerdown', handleFirstInteraction)
      window.removeEventListener('touchstart', handleFirstInteraction)
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('scroll', handleFirstInteraction)
      window.removeEventListener('keydown', handleFirstInteraction)
    }

    window.addEventListener('pointerdown', handleFirstInteraction, { passive: true })
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true })
    window.addEventListener('click', handleFirstInteraction, { passive: true })
    window.addEventListener('scroll', handleFirstInteraction, { passive: true })
    window.addEventListener('keydown', handleFirstInteraction, { passive: true })

    return cleanup
  }, [])

  const scrollToWishes = () => {
    const el = document.getElementById('wishes')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="story-app">
      {/* Soft Romantic Ambient Lighting */}
      <div className="ambience" aria-hidden="true">
        <div className="ambience__glow ambience__rose" />
        <div className="ambience__glow ambience__gold" />
      </div>

      {/* Floating Rose Petals & Golden Stardust */}
      <FloatingPetals />
      <ClickSparkles />
      <ConfettiCannon />

      {/* Sticky Navigation Bar */}
      <StoryNav />

      {/* Seamless Celebration Story Sections */}
      <main className="story-main">
        <HeroStory onScrollDown={scrollToWishes} />
        <WishesStory />
        <CakeStory />
        <MemoriesStory />
        <BalloonsStory />
        <LetterStory />
        <FinaleStory onScrollToTop={scrollToTop} />
      </main>

      {/* Floating Music Prompt if autoplay is pending gesture */}
      {!playing && (
        <button
          type="button"
          className="story-music-prompt"
          onClick={() => {
            sfx.sparkle()
            void playMusic()
          }}
          aria-label="Tap to play celebration melody"
        >
          <Music size={15} />
          <span>Tap anywhere to start celebration music</span>
          <Sparkles size={13} />
        </button>
      )}

      {/* Luxury Gold Corner Frame Accents */}
      <div className="frame" aria-hidden="true">
        <span className="frame__corner frame__corner--tl" />
        <span className="frame__corner frame__corner--tr" />
        <span className="frame__corner frame__corner--bl" />
        <span className="frame__corner frame__corner--br" />
      </div>
    </div>
  )
}
