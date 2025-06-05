
# ---
# Stage 1: Building with node and pnpm
# ---
FROM node:lts-alpine as builder

WORKDIR /app

# Install pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Start the webapp with explicit host and port binding
RUN pnpm run build


# ---
# Stage 2: Final image with nginx
# ---
FROM nginx:stable-alpine as runner

# Copy built assets from build stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
