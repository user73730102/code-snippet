import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from "@sentry/react";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './axiosConfig';

if (window.runtimeConfig && window.runtimeConfig.SENTRY_DSN) {
  Sentry.init({
    dsn: window.runtimeConfig.SENTRY_DSN, // <-- CRUCIAL: Reads from window object
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, 
    // Session Replay
    replaysSessionSampleRate: 0.1, 
    replaysOnErrorSampleRate: 1.0, 
  });
  console.log("Sentry initialized for client."); // <-- Add this for debugging
} else {
  console.log("Sentry DSN not found. Sentry not initialized."); // <-- Add this for debugging
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
