FROM node:22 AS build
ENV NODE_ENV=development
WORKDIR /app
COPY ./package.json ./yarn.lock ./.yarnrc.yml ./
COPY ./packages/aurora-config/package.json ./packages/aurora-config/
COPY ./packages/aurora-core/package.json ./packages/aurora-core/
COPY ./packages/aurora-db-sqlite/package.json ./packages/aurora-db-sqlite/
COPY ./packages/aurora-logger/package.json ./packages/aurora-logger/
RUN corepack enable
RUN yarn install
COPY ./ ./
RUN yarn build

FROM node:22-alpine AS target
ENV NODE_ENV=production

WORKDIR /app
COPY ./package.json ./yarn.lock ./.yarnrc.yml ./
COPY ./packages/aurora-config/package.json ./packages/aurora-config/
COPY ./packages/aurora-core/package.json ./packages/aurora-core/
COPY ./packages/aurora-db-sqlite/package.json ./packages/aurora-db-sqlite/
COPY ./packages/aurora-logger/package.json ./packages/aurora-logger/
RUN apk --no-cache --virtual add \
    git \
    python3 \
    py3-pip \
    g++ \
    make
RUN corepack enable
RUN yarn workspaces focus --all --production
COPY --from=build /app/packages/aurora-core/dist/ ./packages/aurora-core/dist/
COPY --from=build /app/packages/aurora-core/build/ ./packages/aurora-core/build/
COPY --from=build /app/packages/aurora-db-sqlite/dist/ ./packages/aurora-db-sqlite/dist/
COPY --from=build /app/packages/aurora-logger/dist/ ./packages/aurora-logger/dist/
COPY ./public ./public

USER node
CMD ["node", "packages/aurora-core/dist/src/index.js"]
EXPOSE 3000
