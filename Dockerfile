# Stage 1: Build the frontend
FROM node:22-alpine AS frontend-builder

WORKDIR /app

# Copy frontend package files
COPY app/package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source code
COPY app/ ./

# Build the frontend (no environment variables needed - API_URL will be empty for same-origin)
RUN npm run build

# Stage 2: Build the backend
FROM node:22-alpine AS backend-builder

WORKDIR /app

# Copy backend package files
COPY server/package*.json ./

# Install backend dependencies
RUN npm ci

# Copy Prisma config and schema for generation (Prisma 7)
COPY server/prisma.config.ts ./
COPY server/prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy backend source code
COPY server/ ./

# Build the backend
RUN npm run build

# Stage 3: Production image
FROM node:22-alpine AS production

WORKDIR /app

# Install production dependencies only
COPY server/package*.json ./
RUN npm ci --omit=dev

# Copy Prisma config and schema (Prisma 7)
COPY server/prisma.config.ts ./
COPY server/prisma ./prisma

# Generate Prisma client for production
RUN npx prisma generate

# Copy built backend
COPY --from=backend-builder /app/dist ./dist

# Copy generated Prisma client
COPY --from=backend-builder /app/generated ./generated

# Copy built frontend to public folder (served by Express)
COPY --from=frontend-builder /app/dist ./public

# Expose port for the Express server
EXPOSE 3001

# Set environment variable for production
ENV NODE_ENV=production
ENV PORT=3001

# Run database migrations and start server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
