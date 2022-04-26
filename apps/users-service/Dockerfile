FROM node:lts-alpine as build

WORKDIR /app
COPY ./dist/apps/users-service .
COPY yarn.lock .

FROM node:lts-alpine

# add dump-init to avoid nodejs as pid 1
RUN apk add dumb-init
ENV NODE_ENV production 
ARG PORT
USER node

ENV MONGO_URI=mongodb+srv://contacts:fYnc4.ZPdz378t4@cluster0.hiwqy.mongodb.net/users?retryWrites=true&w=majority \
    GOOGLE_CLIENT_ID=739410132871-45r2feessjs5l5rtbk1kekr5t78aa7ee.apps.googleusercontent.com \
    GOOGLE_CLIENT_SECRET=ckcvOhikVvHBi7BeU7n2YzKc \
    JWT_SECRET=alalsdflasjlf343424 \
    PORT=3334 \
    NODE_ENV=production



WORKDIR /home/node/app

# change permissions to the node_modules folder
COPY --chown=node:node --from=build /app /home/node/app/node_modules
COPY --chown=node:node --from=build /app/yarn.lock /home/node/app/yarn.lock
COPY --chown=node:node ./dist/apps/users-service /home/node/app

RUN npm install --production
RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express

EXPOSE ${PORT}
CMD [ "dumb-init", "node", "main.js" ]

