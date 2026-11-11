import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useQuality } from '../lib/useQuality'

interface RevealWordsProps {
  text: string
  className?: string
  delay?: number
}

/**
 * Splits a line into words and lifts each word out of a mask.
 * Used for every display heading so scene changes feel authored.
 */
export function RevealWords({ text, className = '', delay = 0 }: RevealWordsProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const { reduced } = useQuality()

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const words = el.querySelectorAll<HTMLElement>('[data-word]')
    if (!words.length) return
    const ctx = gsap.context(() => {
      gsap.set(words, { yPercent: 118, opacity: 0 })
      gsap.to(words, {
        yPercent: 0,
        opacity: 1,
        duration: reduced ? 0.01 : 1.25,
        ease: 'power4.out',
        stagger: reduced ? 0 : 0.055,
        delay: reduced ? 0 : 0.14 + delay,
      })
    }, el)
    return () => ctx.revert()
  }, [text, delay, reduced])

  const words = text.split(' ')

  return (
    <span ref={ref} className={`heading ${className}`}>
      {words.map((word, index) => (
        <span className="heading__word" key={`${word}-${index}`}>
          <span className="heading__mask">
            <span className="heading__inner" data-word>
              {word}
            </span>
          </span>
        </span>
      ))}
    </span>
  )
}
