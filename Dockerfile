# Build in a different image to keep the target image clean
FROM node:20 AS build
ENV NODE_ENV=development
WORKDIR /app
COPY ./package.json ./yarn.lock ./
RUN yarn
COPY ./ ./
RUN yarn build

# Target image that will be run
FROM node:20-alpine AS target
ENV NODE_ENV=production

WORKDIR /app
COPY ./package.json ./yarn.lock ./
RUN apk add --no-cache git
RUN yarn install --production
COPY --from=build --chown=node /app/dist /app
COPY ./public ./public

CMD [ "node", "src/index.js" ]
EXPOSE 3000
