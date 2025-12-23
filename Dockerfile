###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine AS development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm i pnpm -g
RUN pnpm install

COPY --chown=node:node . .

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm i pnpm -g

# ✅ use pnpm consistently
RUN pnpm run build

ENV NODE_ENV=production

# install prod-only deps
RUN pnpm install --prod

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine AS production

WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

USER node

CMD ["node", "dist/src/main.js"]

