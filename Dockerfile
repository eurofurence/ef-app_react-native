FROM node:lts

COPY --from=oven/bun:1.3 /usr/local/bin/bun /usr/local/bin/bun

WORKDIR /app

COPY package.json bun.lock bunfig.toml ./
COPY patches/ patches/

RUN bun install --frozen-lockfile

COPY . .

RUN bun run bundle:web
