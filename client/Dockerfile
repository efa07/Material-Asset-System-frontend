# Stage 1: base image
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Stage 2: install dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci

# Stage 3: build the Next.js app
FROM deps AS build
COPY . .
RUN npm run build

# Stage 4: final runtime image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.mjs ./next.config.mjs
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["npm", "run", "start"]
