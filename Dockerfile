FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy source code
COPY . .

# Expose the port
EXPOSE 3000

# Start the development server with explicit host binding
CMD ["pnpm", "dev", "--host", "0.0.0.0"]