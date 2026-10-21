import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import PwaUpdatePrompt from './components/pwa/PwaUpdatePrompt';
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
  document.body.textContent = 'OneType failed to initialise. Please refresh the page.';
}
