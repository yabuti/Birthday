import { AnimatePresence, motion } from 'framer-motion'
import { Check, Camera, Gift, Heart, KeyRound, Sparkles } from 'lucide-react'
import { RevealWords } from '../components/RevealWords'
import { GiftPhoto } from '../components/GiftPhoto'
import { GIFTS, type GiftKind } from '../data/content'
import { openGift, useParty } from '../state/party'
import { sfx } from '../lib/sfx'

function GiftIcon({ kind, open }: { kind: GiftKind; open: boolean }) {
  if (open) return <Check size={12} strokeWidth={1.8} />
  if (kind === 'photo') return <Camera size={12} strokeWidth={1.5} />
  if (kind === 'appreciation') return <Heart size={12} strokeWidth={1.5} />
  if (kind === 'mystery') return <KeyRound size={12} strokeWidth={1.5} />
  return <Gift size={12} strokeWidth={1.5} />
}

export function GiftScene() {
  const { openedGifts, activeGift } = useParty()
  const active = GIFTS.find((gift) => gift.id === activeGift) ?? null

  const handleOpen = (id: (typeof GIFTS)[number]['id'], label: string) => {
    if (!openedGifts.includes(id)) sfx.sparkle()
    openGift(id)
    // Screen-reader friendly acknowledgement of the chosen box.
    const region = document.getElementById('gift-announcer')
    if (region) region.textContent = `${label} opened`
  }

  return (
    <section className="scene scene--right scene--gifts" aria-labelledby="gifts-title">
      <div className="panel">
        <p className="eyebrow">Scene V · The Gifts</p>
        <h2 className="scene__title" id="gifts-title">
          <RevealWords text="Four little secrets." />
        </h2>
        <p className="copy">
          Four boxes wait on the floor — each one wrapped differently. Untie a ribbon, lift the lid,
          and see what was kept for you.
        </p>

        <div className="gift-chips" role="group" aria-label="Gift boxes">
          {GIFTS.map((gift) => {
            const isOpen = openedGifts.includes(gift.id)
            return (
              <button
                key={gift.id}
                type="button"
                className={`gift-chip${isOpen ? ' is-open' : ''}`}
                onClick={() => handleOpen(gift.id, gift.label)}
                aria-pressed={isOpen}
              >
                <GiftIcon kind={gift.kind} open={isOpen} />
                {gift.short}
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          {active ? (
            <motion.div
              key={active.id}
              className="gift-note"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="gift-note__label">
                <Sparkles size={11} strokeWidth={1.5} />
                {active.label}
              </span>
              <h3>{active.title}</h3>
              <p>{active.message}</p>

              {active.photo ? <GiftPhoto key={active.id} photo={active.photo} /> : null}

              {active.ticket ? (
                <div className="gift-ticket">
                  <span className="gift-ticket__label">{active.ticket.label}</span>
                  <strong>{active.ticket.value}</strong>
                  <span className="gift-ticket__note">{active.ticket.note}</span>
                </div>
              ) : null}
            </motion.div>
          ) : (
            <p className="panel__note" key="empty">
              {openedGifts.length ? 'Choose another box.' : 'Four boxes. Four little secrets.'}
            </p>
          )}
        </AnimatePresence>

        <p className="sr-only" id="gift-announcer" aria-live="polite" />
      </div>
    </section>
  )
}
