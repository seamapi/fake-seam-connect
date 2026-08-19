FROM node:22.12-alpine AS base

WORKDIR /usr/src/app

RUN apk add --no-cache \
      ca-certificates

RUN deluser --remove-home node \
 && addgroup -S node -g 10000 \
 && adduser -S -G node -u 10000 node

FROM base AS build

COPY package-lock.json ./
COPY package.json ./
# UPSTREAM: Some transitive dependencies run npx in a preinstall script, which
# races against itself over the shared npx cache and fails the install with
# "Text file busy". Skip install scripts, then rebuild only the native modules
# whose postinstall links a platform binary. Rebuilding those by name avoids
# re-running the offending npx preinstall scripts (which produce nothing the
# build needs) while still linking the binaries needed under emulation.
RUN --mount=type=cache,target=/root/.npm npm ci --ignore-scripts
RUN npm rebuild esbuild @swc/core unrs-resolver
COPY . ./
RUN npm run build
RUN npm pack
RUN tar -xzf *.tgz

FROM base AS install

ENV NODE_ENV=production

COPY package-lock.json ./
COPY package.json ./
# See the note in the build stage: rebuild native modules by name to avoid the
# racing npx preinstall scripts. This stage installs production dependencies
# only, so the list is a no-op unless a native runtime dependency is added.
RUN --mount=type=cache,target=/root/.npm npm ci --ignore-scripts
RUN npm rebuild esbuild @swc/core unrs-resolver
RUN rm package.json package-lock.json

FROM base AS app

COPY --from=install /usr/src/app .
COPY --from=build /usr/src/app/package .

ENV NODE_ENV=production \
    PORT=8080

EXPOSE 8080

ENTRYPOINT ["node", "./dist/server.js"]

USER node
