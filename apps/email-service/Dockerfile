FROM node:lts-alpine as build

WORKDIR /app
RUN touch /app/package-lock.json
COPY ./dist/apps/email-service .

FROM node:lts-alpine

# add dump-init to avoid nodejs as pid 1
RUN apk add dumb-init
ARG NODE_ENV
ARG PORT
USER node

ENV NODE_ENV ${NODE_ENV} \
    POSTMARK_TOKEN=971be359-e1c4-44b2-bfcc-72df8e1b71f7

WORKDIR /home/node/app

# change permissions to the node_modules folder
COPY --chown=node:node --from=build /app /home/node/app/node_modules
COPY --chown=node:node --from=build /app/package-lock.json /home/node/app/package-lock.json
COPY --chown=node:node ./dist/apps/email-service /home/node/app

RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express

EXPOSE ${PORT}
CMD [ "dumb-init", "node", "main.js" ]

