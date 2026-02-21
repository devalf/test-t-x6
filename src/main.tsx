import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/App'
import { registerService } from './api/registry'
import { openMeteoService } from './api/services/openMeteo'
import { weatherApiService } from './api/services/weatherApi'

registerService(openMeteoService)
registerService(weatherApiService)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
