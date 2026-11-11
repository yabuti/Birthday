import { useMemo } from 'react'
import { ArrowRight, Images, Mail, Sparkles, Heart } from 'lucide-react'
import { RevealWords } from '../components/RevealWords'
import { GoldButton } from '../components/GoldButton'
import { Ornament } from '../components/Ornament'
import { enterCelebration, setScene } from '../state/party'
import { BIRTHDAY } from '../config'
import { sfx } from '../lib/sfx'
import { getImageCandidates, useResolvedImage } from '../lib/images'
import { playMusic } from '../lib/music'

export function WelcomeScene() {
  const heroCandidates = useMemo(() => {
    return [
      '/photos/yab.jpg',
      '/photos/yab2.jpg',
      '/photos/hero.jpg',
      '/photos/hero.png',
      '/hero.jpg',
      '/hero.png',
      '/photos/yeabsera.jpg',
      '/photos/yeabsera.png',
      '/yeabsera.jpg',
      '/yeabsera.png',
      '/photos/1.jpg',
      '/photos/1.png',
      '/1.jpg',
      '/1.png',
      '/photo.jpg',
      ...getImageCandidates(0, 'hero', BIRTHDAY.photos[0]?.src),
    ]
  }, [])

  const { src: heroSrc, hasImage } = useResolvedImage(heroCandidates)

  const handleEnter = () => {
    sfx.enter()
    void playMusic()
    enterCelebration()
  }

  const handleGoMemories = () => {
    sfx.chime(659.25)
    void playMusic()
    setScene(5)
  }

  const handleGoLetter = () => {
    sfx.chime(783.99)
    void playMusic()
    setScene(6)
  }

  return (
    <section className="scene scene--welcome" aria-labelledby="welcome-title">
      <div className="welcome-editorial">
        {/* Left Editorial Content */}
        <div className="welcome-editorial__content">
          <div className="welcome-editorial__eyebrow fade-up">
            <Sparkles size={12} className="welcome-editorial__star" />
            <span>AN EXCLUSIVE CELEBRATION · CHAPTER I</span>
            <Sparkles size={12} className="welcome-editorial__star" />
          </div>

          <h1 className="welcome-editorial__title" id="welcome-title">
            <RevealWords text={`Happy ${BIRTHDAY.age}th Birthday,`} />
            <RevealWords text={BIRTHDAY.firstName} className="heading--gold" delay={0.4} />
          </h1>

          <p className="welcome-editorial__sub fade-up" style={{ animationDelay: '0.7s' }}>
            {BIRTHDAY.welcomeSubtitle}
          </p>

          <p className="welcome-editorial__dedication fade-up" style={{ animationDelay: '0.85s' }}>
            Twenty-five years of grace, kindness, and unforgettable light. May this milestone chapter
            unfold with boundless joy, peace, and the fulfillment of your greatest dreams.
          </p>

          <div className="welcome-editorial__actions fade-up" style={{ animationDelay: '1s' }}>
            <GoldButton
              variant="primary"
              className="btn--enter-luxury"
              onClick={handleEnter}
              icon={<ArrowRight size={15} strokeWidth={1.5} />}
            >
              Enter the Celebration
            </GoldButton>

            <div className="welcome-editorial__links">
              <button
                type="button"
                className="welcome-editorial__link"
                onClick={handleGoMemories}
                title="Browse photo memories"
              >
                <Images size={14} />
                <span>Memory Gallery</span>
              </button>

              <span className="welcome-editorial__link-divider">•</span>

              <button
                type="button"
                className="welcome-editorial__link"
                onClick={handleGoLetter}
                title="Read your personal letter"
              >
                <Mail size={14} />
                <span>Birthday Letter</span>
              </button>
            </div>
          </div>

          <div className="welcome-editorial__ornament fade-up" style={{ animationDelay: '1.2s' }}>
            <Ornament />
          </div>
        </div>

        {/* Right Luxury Portrait Card */}
        <div className="welcome-editorial__portrait-wrapper fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="portrait-card">
            <div className="portrait-card__glow" aria-hidden="true" />
            
            <div className="portrait-card__frame">
              <span className="portrait-card__pin portrait-card__pin--tl" />
              <span className="portrait-card__pin portrait-card__pin--tr" />
              <span className="portrait-card__pin portrait-card__pin--bl" />
              <span className="portrait-card__pin portrait-card__pin--br" />

              <div className="portrait-card__image-container">
                {hasImage && heroSrc ? (
                  <img
                    src={heroSrc}
                    alt={BIRTHDAY.name}
                    className="portrait-card__img"
                    loading="eager"
                  />
                ) : (
                  <div className="portrait-card__placeholder">
                    <span className="portrait-card__monogram">Y</span>
                    <span className="portrait-card__label">YABYE</span>
                  </div>
                )}
                <div className="portrait-card__shimmer" aria-hidden="true" />
              </div>

              <div className="portrait-card__caption">
                <span className="portrait-card__name">{BIRTHDAY.name}</span>
                <span className="portrait-card__meta">
                  <Heart size={9} fill="currentColor" />
                  <span>Golden XXV · 25 Years of Light</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
