# Multi-stage build for MCP GitHub Projects Server
FROM node:lts-alpine AS base

# Install necessary packages: curl and bash
RUN apk add --no-cache curl bash git

# Install Bun via provided installation script
RUN curl -fsSL https://bun.sh/install | bash

# Set environment variables for Bun
ENV BUN_INSTALL=/root/.bun
ENV PATH=/root/.bun/bin:$PATH

# Set working directory
WORKDIR /app

# Development stage
FROM base AS development
COPY package.json bun.lock ./
RUN bun install
COPY . .
CMD ["bun", "run", "src/index.ts"]

# Build stage
FROM base AS build
COPY package.json bun.lock ./
RUN bun install --ignore-scripts
COPY . .
RUN bun run build

# Production stage
FROM node:lts-alpine AS production
WORKDIR /app

# Copy only the built application and necessary files
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules

# Expose port (if needed for web interface)
EXPOSE 3000

# Command to start the MCP server
CMD ["node", "build/index.js"]
