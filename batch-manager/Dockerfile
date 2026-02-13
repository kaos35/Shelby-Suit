FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/
COPY config/ ./config/

RUN npx tsc --outDir dist || true

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install only production deps + native module build tools
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json ./
RUN npm ci --only=production && apk del python3 make g++

COPY --from=builder /app/dist ./dist
COPY config/ ./config/

EXPOSE 8080

CMD ["node", "dist/cli/index.js", "start", "-c", "./config/accounts.yaml"]
