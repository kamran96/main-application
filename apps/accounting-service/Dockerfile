FROM node:lts-alpine
WORKDIR /app
COPY ./dist/apps/items-service .
ENV PORT=3336
ENV NODE_ENV=production
EXPOSE ${PORT}
RUN npm install --production
RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express
CMD node ./main.js