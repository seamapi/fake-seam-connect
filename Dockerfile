FROM node:20.18 AS base

WORKDIR /usr/src/app

RUN apk add --no-cache \
      ca-certificates

RUN deluser --remove-home node \
 && addgroup -S node -g 10000 \
 && adduser -S -G node -u 10000 node

FROM base AS build

COPY package-lock.json ./
COPY package.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . ./
RUN npm run build
RUN npm pack
RUN tar -xzf *.tgz

FROM base AS install

ENV NODE_ENV=production

COPY package-lock.json ./
COPY package.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
RUN rm package.json package-lock.json

FROM base AS app

COPY --from=install /usr/src/app .
COPY --from=build /usr/src/app/package .

ENV NODE_ENV=production \
    PORT=8080

EXPOSE 8080

ENTRYPOINT ["node", "./dist/server.js"]

USER node
