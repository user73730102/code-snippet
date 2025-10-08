#!/bin/sh

API_URL=${REACT_APP_API_URL:-"http://localhost:5000"}
SENTRY_DSN=${SENTRY_DSN:-""} # <-- Add this line

# Update the config file to include both variables
echo "window.runtimeConfig = { API_URL: \"$API_URL\", SENTRY_DSN: \"$SENTRY_DSN\" };" > /usr/share/nginx/html/config.js

exec "$@"