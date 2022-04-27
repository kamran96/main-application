FROM node:lts-alpine as build

WORKDIR /app
RUN touch /app/package-lock.json
COPY ./dist/apps/users-service .

FROM node:lts-alpine

# add dump-init to avoid nodejs as pid 1
RUN apk add dumb-init
ARG PORT
USER node

ENV NODE_ENV=production \
    MONGO_URI=mongodb+srv://contacts:fYnc4.ZPdz378t4@cluster0.hiwqy.mongodb.net/users?retryWrites=true&w=majority \
    GOOGLE_CLIENT_ID=739410132871-45r2feessjs5l5rtbk1kekr5t78aa7ee.apps.googleusercontent.com \
    GOOGLE_CLIENT_SECRET=ckcvOhikVvHBi7BeU7n2YzKc \
    JWT_SECRET=alalsdflasjlf343424 \
    PORT=3334 \
    EXPIRES='12'

WORKDIR /home/node/app

# change permissions to the node_modules folder
COPY --chown=node:node --from=build /app /home/node/app/node_modules
COPY --chown=node:node --from=build /app/package-lock.json /home/node/app/package-lock.json
COPY --chown=node:node ./dist/apps/users-service /home/node/app

RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express

EXPOSE ${PORT}
CMD [ "dumb-init", "node", "main.js" ]

