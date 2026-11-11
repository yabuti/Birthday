import { useMemo } from 'react'
import { ChevronDown, Heart, Sparkles, Music } from 'lucide-react'
import { BIRTHDAY } from '../config'
import { getImageCandidates, useResolvedImage } from '../lib/images'
import { playMusic } from '../lib/music'
import { sfx } from '../lib/sfx'

interface HeroStoryProps {
  onScrollDown: () => void
}

export function HeroStory({ onScrollDown }: HeroStoryProps) {
  const heroCandidates = useMemo(() => {
    return [
      '/photos/yab.jpg',
      '/photos/yab2.jpg',
      '/photos/hero.jpg',
      '/hero.jpg',
      ...getImageCandidates(0, 'hero', BIRTHDAY.photos[0]?.src),
    ]
  }, [])

  const { src: heroSrc, hasImage } = useResolvedImage(heroCandidates)

  const handleStartMusic = () => {
    sfx.sparkle()
    void playMusic()
  }

  return (
    <header className="story-hero">
      <div className="story-hero__badge">
        <Sparkles size={12} className="story-hero__sparkle" />
        <span>A Special Celebration Just For You</span>
        <Sparkles size={12} className="story-hero__sparkle" />
      </div>

      <div className="story-hero__portrait-box">
        <div className="story-hero__portrait-halo" aria-hidden="true" />
        <div className="story-hero__portrait-frame">
          {hasImage && heroSrc ? (
            <img
              src={heroSrc}
              alt={BIRTHDAY.name}
              className="story-hero__portrait-img"
              loading="eager"
            />
          ) : (
            <div className="story-hero__portrait-placeholder">
              <span className="story-hero__portrait-monogram">Y</span>
              <span>YEABSERA</span>
            </div>
          )}
          <div className="story-hero__portrait-shimmer" aria-hidden="true" />
        </div>
        <div className="story-hero__portrait-tag">
          <Heart size={10} fill="currentColor" />
          <span>Golden 25th Birthday</span>
        </div>
      </div>

      <div className="story-hero__text">
        <h1 className="story-hero__title">
          Happy 25th Birthday,
          <span className="story-hero__name">{BIRTHDAY.firstName}</span>
        </h1>

        <p className="story-hero__sub">
          {BIRTHDAY.welcomeSubtitle}
        </p>

        <p className="story-hero__dedication">
          Today is all about celebrating your radiant smile, your gentle warmth, and the boundless grace you bring into the world.
        </p>
      </div>

      <div className="story-hero__actions">
        <button
          type="button"
          className="story-btn story-btn--primary"
          onClick={handleStartMusic}
        >
          <Music size={15} />
          <span>Play Celebration Melody</span>
        </button>

        <button
          type="button"
          className="story-hero__scroll-btn"
          onClick={onScrollDown}
          aria-label="Scroll down to begin celebration"
        >
          <span>Scroll down to celebrate</span>
          <ChevronDown size={18} className="story-hero__arrow" />
        </button>
      </div>
    </header>
  )
}
