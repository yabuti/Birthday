import { CakeSlice, RotateCcw, Sparkles } from 'lucide-react'
import { RevealWords } from '../components/RevealWords'
import { GoldButton } from '../components/GoldButton'
import { cutCake, resetCake, useParty } from '../state/party'
import { sfx } from '../lib/sfx'

export function CutScene() {
  const { cakeCut } = useParty()

  return (
    <section className="scene scene--cut" aria-labelledby="cut-title">
      <div className="panel">
        <p className="eyebrow">Scene III · The Slice</p>
        <h2 className="scene__title" id="cut-title">
          <RevealWords text="The first slice." />
        </h2>
        <p className="copy">
          A golden knife, a quiet moment, and the sweetest beginning of twenty-five. The first slice
          belongs to the birthday girl — always.
        </p>

        <div className="panel__actions">
          <GoldButton
            onClick={() => {
              sfx.slice()
              cutCake()
            }}
            disabled={cakeCut}
            icon={<CakeSlice size={15} strokeWidth={1.4} />}
          >
            {cakeCut ? 'Already sliced' : 'Cut the cake'}
          </GoldButton>
          {cakeCut ? (
            <GoldButton
              variant="ghost"
              onClick={() => {
                sfx.chime(523.25)
                resetCake()
              }}
              icon={<RotateCcw size={14} strokeWidth={1.4} />}
            >
              Reset the cake
            </GoldButton>
          ) : null}
        </div>

        {cakeCut ? (
          <p className="slice-badge fade-up">
            <Sparkles size={13} strokeWidth={1.5} /> One slice, plated in gold
          </p>
        ) : (
          <p className="panel__note">Watch the knife — the slice lifts out on its own.</p>
        )}
      </div>
    </section>
  )
}
