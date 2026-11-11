import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/index.css'
import './styles/ui.css'
import './styles/scenes.css'

const container = document.getElementById('root')
if (!container) throw new Error('Root element not found')

createRoot(container).render(<App />)
