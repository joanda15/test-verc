import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Registro de service worker (opcional)
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/service-worker.js')
//     .then(registration => {
//       console.log('Service Worker registrado con éxito:', registration);
//     })
//     .catch(error => {
//       console.log('Error al registrar el Service Worker:', error);
//     });
// }
