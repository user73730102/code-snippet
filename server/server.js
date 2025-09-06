require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Sentry = require('@sentry/node'); // Import the main object

const app = express();

// --- SENTRY INITIALIZATION ---
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  // We must explicitly add the express integration to get the handlers
  integrations: [Sentry.expressIntegration()],
  tracesSampleRate: 1.0,
});


// --- MIDDLEWARE ---

// The Express integration automatically adds request and tracing handlers now.
// We don't need to add them manually.

// Your standard middleware
app.use(cors());
app.use(express.json());


// --- DATABASE & ROUTES ---
mongoose.connect(process.env.MONGO_URI, { /* ... */ })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => Sentry.captureException(err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/snippets', require('./routes/snippets'));


// --- SENTRY ERROR HANDLER ---
// Use the specific expressErrorHandler function we saw in the log
app.use(Sentry.expressErrorHandler());


// --- SERVER LISTENER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));