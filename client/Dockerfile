# --- Stage 1: Build the React application ---
FROM node:22-alpine AS builder

WORKDIR /app

# These two lines accept the URL at build time. This is correct.
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY package*.json ./
RUN npm ci

COPY . .

# This command will now use the REACT_APP_API_URL provided during the build.
RUN npm run build

# --- Stage 2: Serve the static files with Nginx ---
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html

# The lines for entrypoint.sh have been REMOVED. This is correct.

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]