import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { starteBelegungsabgleich } from './data/belegung';
import { ladeInhalt } from './data/wohnungen';

// Erst die Inhalte aus dem Admin laden (inhalt.json), dann die Seite zeigen
ladeInhalt().then(() => {
  starteBelegungsabgleich();
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
