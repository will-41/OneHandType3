
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Simple error logging
window.addEventListener('error', (e) => {
});

window.addEventListener('unhandledrejection', (e) => {
});

const root = document.getElementById('root');

if (root) {
  const reactRoot = createRoot(root);
  
  reactRoot.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  document.body.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #1e293b; color: white; font-family: system-ui;">
      <div style="text-align: center;">
        <h1 style="font-size: 2rem; margin-bottom: 1rem;">OneType Error</h1>
        <p>Failed to initialize application. Please refresh the page.</p>
        <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">
          Refresh
        </button>
      </div>
    </div>
  `;
}
