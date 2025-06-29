FROM node:lts

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install

COPY src/ assets/ android/ ./

RUN pnpm expo build:web
