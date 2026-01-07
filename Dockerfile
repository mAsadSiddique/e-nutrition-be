###################
# BASE
###################
FROM node:18-alpine AS base

WORKDIR /usr/src/app

RUN npm install -g pnpm

###################
# DEPENDENCIES
###################
FROM base AS deps

COPY package.json pnpm-lock.yaml ./

# cache pnpm store
RUN pnpm install --frozen-lockfile

###################
# BUILD
###################
FROM base AS build

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV NODE_ENV=production

RUN pnpm run build

###################
# PRODUCTION
###################
FROM node:18-alpine AS production

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

USER node

CMD ["node", "dist/src/main.js"]
