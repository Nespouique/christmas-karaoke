FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev for prisma generate)
RUN npm ci

# Copy Prisma schema and config
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Generate Prisma client (need a dummy DATABASE_URL for generation)
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN npx prisma generate

# Copy source code
COPY src ./src/
COPY tsconfig.json ./

# Build TypeScript
RUN npm run build

# Install prisma globally (needed for migrate deploy and prisma studio)
RUN npm install -g prisma

# Remove dev dependencies
RUN npm prune --omit=dev

# Expose port
EXPOSE 3001

# Start server (prisma is installed globally)
CMD ["sh", "-c", "prisma migrate deploy && node dist/index.js"]
