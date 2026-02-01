# Stage 1: base image
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# Stage 2: install dependencies with dev tools for build
FROM base AS deps
RUN apk add --no-cache python3 make g++ && ln -sf python3 /usr/bin/python
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
RUN npx prisma generate

# Stage 3: build the NestJS app
FROM deps AS build
COPY tsconfig*.json nest-cli.json ./
COPY src ./src
COPY test ./test
RUN npm run build

# Stage 4: prune dev dependencies
FROM deps AS prod-deps
RUN npm prune --omit=dev

# Stage 5: final runtime image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=prod-deps /app/node_modules ./node_modules
COPY prisma ./prisma
COPY package*.json ./
EXPOSE 5000
CMD ["node", "dist/main.js"]
