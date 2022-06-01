FROM node:lts-alpine as build

WORKDIR /app
RUN touch /app/package-lock.json
COPY ./dist/apps/payments-service .

FROM node:lts-alpine

# add dump-init to avoid nodejs as pid 1
RUN apk add dumb-init
ENV NODE_ENV production
ARG PORT
USER node

ENV DB_HOST='db-postgresql-sgp1-12041-do-user-4046074-0.b.db.ondigitalocean.com' \
    DB_PORT=25060 \
    PAYMENT_DB_NAME='payments' \
    DB_PASSWORD='0jN4FNuqynhGR7zT' \
    DB_USER='doadmin' \
    JWT_SECRET=alalsdflasjlf343424 \
    PORT=3341 \
    NODE_ENV=production

WORKDIR /home/node/app

# change permissions to the node_modules folder
COPY --chown=node:node --from=build /app /home/node/app/node_modules
COPY --chown=node:node --from=build /app/package-lock.json /home/node/app/package-lock.json
COPY --chown=node:node ./dist/apps/payments-service /home/node/app

# nx has a bug (which isn't picking pg). once it's fixed, we can remove it.
RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express pg

EXPOSE ${PORT}
CMD [ "dumb-init", "node", "main.js" ]

