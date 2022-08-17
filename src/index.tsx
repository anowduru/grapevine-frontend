import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initializeIcons } from '@fluentui/react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// init fabric icons
initializeIcons();

root.render(
  <App />
);