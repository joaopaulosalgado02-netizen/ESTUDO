import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { initializeMotion } from './lib/motion';
import './styles.css';
import './styles/polish.css';
import './styles/continuity.css';
import './styles/physical-book.css';

initializeMotion();
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
