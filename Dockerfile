FROM node:lts

COPY package.json yarn.lock* ./

RUN yarn install

COPY src/ assets/ android/ ./

RUN yarn expo build:web
