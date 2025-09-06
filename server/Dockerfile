# --- Stage 1: Build the application ---
# Use the official Node.js 22 Alpine image. Alpine is a very small Linux distribution.
FROM node:22-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker's build cache
COPY package*.json ./
# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of your application code
COPY . .

# --- Stage 2: Create the final, small production image ---
FROM node:22-alpine

WORKDIR /app

# Copy the installed dependencies and your code from the 'builder' stage
COPY --from=builder /app .

# Expose the port the app runs on. Render will use this.
EXPOSE 5000

# The command to start the server
CMD [ "node", "server.js" ]