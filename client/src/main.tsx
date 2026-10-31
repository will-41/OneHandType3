import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import PwaUpdatePrompt from './components/pwa/PwaUpdatePrompt';
// Self-hosted Atkinson Hyperlegible Next and Mono, and Literata (all SIL OFL 1.1): bundled, work offline, no font CDN.
import '@fontsource/atkinson-hyperlegible-next/latin-400.css';
import '@fontsource/atkinson-hyperlegible-next/latin-500.css';
import '@fontsource/atkinson-hyperlegible-next/latin-700.css';
import '@fontsource/atkinson-hyperlegible-mono/latin-400.css';
import '@fontsource/atkinson-hyperlegible-mono/latin-500.css';
import '@fontsource/atkinson-hyperlegible-mono/latin-700.css';
import '@fontsource/literata/latin-500.css';
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
