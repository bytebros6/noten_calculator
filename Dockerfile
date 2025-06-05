FROM node:lts-alpine

WORKDIR /app

# Install pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy source code
COPY . .

# Start the webapp with explicit host and port binding
RUN pnpm run build --host 0.0.0.0 --port 3000

# Expose the port
EXPOSE 3000
