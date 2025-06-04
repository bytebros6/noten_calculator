FROM node:20-alpine

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .

# Expose the port your app runs on (adjust if it's not 3000)
EXPOSE 3000

CMD ["pnpm", "run", "dev"]