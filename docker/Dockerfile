# Multi-stage build for production: frontend + backend in single container

# Stage 1: Build frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app

# Copy full project (filtered by .dockerignore) to ensure all assets/configs are present
COPY . .

# Install dependencies and build frontend (webpack outputs to target/classes/static/)
RUN npm install && npm run webapp:prod

# Stage 2: Build backend
FROM node:22-alpine AS backend-build
WORKDIR /app

# Copy backend package files
COPY server/package*.json ./server/
COPY server/tsconfig.json ./server/

# Install backend dependencies
WORKDIR /app/server
RUN npm install

# Copy backend source
COPY server/src ./src

# Build backend (outputs to dist/)
RUN npm run build && npm prune --production

# Stage 3: Production image
FROM node:22-alpine AS production
WORKDIR /app

# Copy built backend and production node_modules
COPY --from=backend-build /app/server/dist ./dist
COPY --from=backend-build /app/server/node_modules ./node_modules
COPY server/package.json ./package.json

# Copy built frontend to be served as static files
COPY --from=frontend-build /app/target/classes/static ./dist/public

# Copy backend templates if needed
COPY server/src/templates ./dist/templates

# Expose port
EXPOSE 8080

# Set production environment
ENV NODE_ENV=production

# Start backend (will serve frontend static files)
CMD ["node", "dist/index.js"]
