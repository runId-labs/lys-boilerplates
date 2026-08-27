# Development image (default target) — source is volume-mounted by compose,
# node_modules lives in an anonymous volume (Linux binaries, isolated from
# the host). Vite HMR with polling for reliable events on macOS mounts.
#
# lys-front is consumed as the npm package (runid-lys) — see package.json.
#
# Production image: docker build --target prod
FROM node:20-alpine AS dev

WORKDIR /app

EXPOSE 5173

CMD ["sh", "-c", "rm -f node_modules/.package-lock.json && npm install && npm run dev -- --host 0.0.0.0"]


# ---------------------------------------------------------------------------
# Production
# ---------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY schema.graphql ./

# Install dependencies
RUN npm ci

# Copy source files
COPY src/ src/
COPY public/ public/
COPY scripts/ scripts/
COPY index.html vite.config.js tsconfig.json ./

# Build
RUN npm run build

# Serve
FROM nginx:alpine AS prod

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
