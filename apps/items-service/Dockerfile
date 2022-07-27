FROM node:lts-alpine as build

WORKDIR /app
RUN touch /app/package-lock.json
COPY ./dist/apps/items-service .

FROM node:lts-alpine

# add dump-init to avoid nodejs as pid 1
RUN apk add dumb-init
ARG PORT
USER node

ENV NODE_ENV=production

WORKDIR /home/node/app

# change permissions to the node_modules folder
COPY --chown=node:node --from=build /app /home/node/app/node_modules
COPY --chown=node:node --from=build /app/package-lock.json /home/node/app/package-lock.json
COPY --chown=node:node ./dist/apps/items-service /home/node/app

RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express --legacy-peer-deps

EXPOSE ${PORT}
CMD [ "dumb-init", "node", "main.js" ]

