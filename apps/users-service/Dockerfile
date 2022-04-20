FROM node:lts-alpine
WORKDIR /app
COPY ./dist/apps/users-service .
EXPOSE ${PORT}
RUN npm install --production
RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express
CMD node ./main.js