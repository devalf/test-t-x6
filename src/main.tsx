import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { registerService } from './api/registry';
import { openMeteoService } from './api/services/openMeteo';
import { weatherApiService } from './api/services/weatherApi';

import App from './App.tsx';

import './index.css';

registerService(openMeteoService)
registerService(weatherApiService)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
