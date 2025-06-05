FROM node:22-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Expose the port
EXPOSE 4173 

# Start the development server with explicit host binding
RUN pnpm build
CMD ["pnpm", "preview"]