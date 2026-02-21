import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { registerService } from './api/registry';
import { openMeteoService } from './api/services/openMeteo';
import { wttrInService } from './api/services/wttrIn';

import App from './App.tsx';

import './index.css';

registerService(openMeteoService);
registerService(wttrInService);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
