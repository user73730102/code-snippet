require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = 'express';
const Sentry = require('@sentry/node');

const app = express();

// --- SENTRY INITIALIZATION ---
// This part is correct.
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // This integration automatically adds request and tracing handlers.
    // It does this by "monkey-patching" Express's methods behind the scenes.
    Sentry.expressIntegration(),
  ],
  tracesSampleRate: 1.0,
});

// --- MIDDLEWARE ---

// Your standard middleware
app.use(cors());
app.use(express.json());


// --- DATABASE & ROUTES ---
mongoose.connect(process.env.MONGO_URI, { /* your options here */ })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => {
      console.error('MongoDB Connection Error:', err);
      Sentry.captureException(err);
  });

// YOUR API ROUTES MUST COME *BEFORE* THE SENTRY ERROR HANDLER
app.use('/api/auth', require('./routes/auth'));
app.get('/api/snippets', require('./routes/snippets'));


// --- SENTRY ERROR HANDLER ---
// The Sentry error handler must be registered AFTER all your controllers/routes,
// but BEFORE any of your own custom error handlers.
// This is the most critical change.
app.use(Sentry.expressErrorHandler());


// --- SERVER LISTENER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

module.exports = app;