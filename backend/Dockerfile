# =========================================================
# Stage 1: Build Stage
# =========================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy TypeScript source files
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript to dist
RUN npm run build

# =========================================================
# Stage 2: Production Runtime Stage
# =========================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production
ENV PORT=5000

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled JS files from builder stage
COPY --from=builder /app/dist ./dist

# Create uploads directory and set permissions for non-root user
RUN mkdir -p uploads/resumes && chown -R node:node /app

# Switch to non-root node user
USER node

# Expose backend port
EXPOSE 5000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/health || exit 1

# Start production server
CMD ["node", "dist/index.js"]
