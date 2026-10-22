import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import PwaUpdatePrompt from './components/pwa/PwaUpdatePrompt';
// Self-hosted Inter (SIL OFL 1.1): bundled, works offline, no font CDN.
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './index.css';

// Dark-first: avoid a light flash before the store syncs the theme.
document.documentElement.classList.add('dark');

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
      <PwaUpdatePrompt />
    </StrictMode>
  );
} else {
  document.body.textContent = 'One-Type failed to initialise. Please refresh the page.';
}
