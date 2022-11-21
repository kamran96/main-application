FROM node:lts-alpine as build

WORKDIR /app
RUN touch /app/package-lock.json
COPY package.json .

FROM node:lts-alpine

ARG NODE_ENV
USER node

WORKDIR /home/node/app

COPY package.json /home/node/app/
COPY --chown=node:node --from=build /app/package-lock.json /home/node/app/package-lock.json

RUN npm install --legacy-peer-deps
RUN npm run acc_migration_run


RUN git clone https://github.com/vishnubob/wait-for-it.git

