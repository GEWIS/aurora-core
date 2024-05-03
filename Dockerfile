# Build in a different image to keep the target image clean
FROM node:20 as build
ENV NODE_ENV development
WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN npm install
COPY ./ ./
RUN npm run build

# Target image that will be run
FROM node:20 as target
ENV NODE_ENV production

WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN npm ci
COPY --from=build --chown=node /app/dist /app
COPY ./public ./public

CMD [ "node", "src/index.js" ]
EXPOSE 3000
