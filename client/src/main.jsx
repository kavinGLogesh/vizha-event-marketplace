// main.jsx — Application entry point
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import Google Fonts for premium Tamil wedding aesthetic
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;600;700&display=swap';
document.head.appendChild(fontLink);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
