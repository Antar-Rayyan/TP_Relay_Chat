import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import store from './store.js';
import './index.css';
import App from './App.js';
import reportWebVitals from './reportWebVitals.js';
import PusherClient from './notifications/PusherClient.tsx';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <PusherClient>
        <App />
      </PusherClient>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
      navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
              console.log('Service Worker enregistré avec succès :', registration);
          })
          .catch((error) => {
              console.error('Échec de l\'enregistrement du Service Worker :', error);
          });
  });
}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
