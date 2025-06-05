FROM node:22-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml ./

RUN npm install -g npm@latest
RUN npm install -g pnpm@10.11.0
RUN pnpm install

# Copy source code
COPY . .

# Expose the port
EXPOSE 3000

# Start the development server with explicit host binding
CMD ["pnpm", "dev", "--host", "0.0.0.0"]