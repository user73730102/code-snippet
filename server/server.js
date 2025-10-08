require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // <-- THE FIX IS HERE
const Sentry = require('@sentry/node');

const app = express();

// --- SENTRY INITIALIZATION ---
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    Sentry.expressIntegration(),
  ],
  tracesSampleRate: 1.0,
});

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());


// --- DATABASE & ROUTES ---
mongoose.connect(process.env.MONGO_URI, { /* your options here */ })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => {
      console.error('MongoDB Connection Error:', err);
      Sentry.captureException(err);
  });

app.use('/api/auth', require('./routes/auth'));
app.use('/api/snippets', require('./routes/snippets'));


// --- SENTRY ERROR HANDLER ---
// Placed AFTER all routes to catch errors from them.
app.use(Sentry.expressErrorHandler());


// --- SERVER LISTENER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

module.exports = app;