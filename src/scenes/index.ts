import type { ComponentType } from 'react'
import type { SceneId } from '../state/party'
import { WelcomeScene } from './WelcomeScene'
import { CakeScene } from './CakeScene'
import { CutScene } from './CutScene'
import { BalloonScene } from './BalloonScene'
import { GiftScene } from './GiftScene'
import { MemoriesScene } from './MemoriesScene'
import { LetterScene } from './LetterScene'
import { FinaleScene } from './FinaleScene'

export const sceneComponents: Record<SceneId, ComponentType> = {
  welcome: WelcomeScene,
  cake: CakeScene,
  cut: CutScene,
  balloons: BalloonScene,
  gifts: GiftScene,
  memories: MemoriesScene,
  letter: LetterScene,
  finale: FinaleScene,
}
