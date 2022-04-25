# Start from the dependencies image
FROM node:lts-alpine as build
WORKDIR /app
COPY . .

RUN npm install --production
RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express

FROM node:lts-alpine


# Copy your local project to the image's WORKDIR

# add dump-init to avoid nodejs as pid 1
RUN apk add dumb-init
ENV NODE_ENV production 
ARG PORT
USER node
WORKDIR /home/node/app
# change permissions to the node_modules folder
COPY --chown=node:node --from=build /app/node_modules /home/node/app/node_modules
COPY --chown=node:node ./dist/apps/users-service /home/node/app

EXPOSE ${PORT}
CMD [ "dumb-init", "node", "main.js" ]
