# Build in a different image to keep the target image clean
FROM node:22 AS build
ENV NODE_ENV=development
WORKDIR /app
COPY ./package.json ./yarn.lock ./.yarnrc.yml ./
RUN corepack enable
RUN yarn
COPY ./ ./
RUN yarn build

# Target image that will be run
FROM node:22-alpine AS target
ENV NODE_ENV=production

WORKDIR /app
COPY ./package.json ./yarn.lock ./.yarnrc.yml ./
RUN apk --no-cache --virtual add \
    git \
    # Python is required by node-gyp to build node dependencies (sqlite3)
    python3 \
    py3-pip \
    g++ \
    make
RUN corepack enable
RUN yarn workspaces focus --all --production
COPY --from=build --chown=node /app/dist /app
COPY ./public ./public

CMD [ "node", "src/index.js" ]
EXPOSE 3000
