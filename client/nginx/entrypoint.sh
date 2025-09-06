#!/bin/sh
# This script runs when the container starts.

# Use the REACT_APP_API_URL from the environment, or a default.
API_URL=${REACT_APP_API_URL:-"http://localhost:5000"}

# Create the config.js file in the public directory
echo "window.runtimeConfig = { API_URL: \"$API_URL\" };" > /usr/share/nginx/html/config.js

# Let the original Nginx entrypoint continue
exec "$@"