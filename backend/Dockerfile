FROM node:18-bookworm

WORKDIR /app

# Install OpenSSL 3 for Prisma
RUN apt-get update && apt-get install -y openssl libssl3 && rm -rf /var/lib/apt/lists/*

# Set environment variable to identify containerized environment
ENV DOCKER_CONTAINER=true

# Copy prisma schema first (needed for postinstall -> prisma generate)
COPY prisma ./prisma

# package.json kopieren und installieren
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copy .env file for DATABASE_URL in Cloud Run
COPY .env .
COPY .env.example ./

# If .env doesn't exist, create from .env.example
RUN if [ ! -s .env ]; then cp .env.example .env; fi

# Prisma generieren (already copied via postinstall, just verify)
RUN npx prisma generate

# Source kopieren und transpilieren
COPY tsconfig.json ./
COPY src ./src
RUN npx tsc

# Create public directory for uploaded images (will be populated at runtime)
RUN mkdir -p public/images/gallery

EXPOSE 8080

# Server starten (keine automatische Migration - muss separat ausgeführt werden)
CMD ["node", "dist/index.js"]