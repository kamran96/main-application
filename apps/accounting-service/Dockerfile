FROM node:lts-alpine
WORKDIR /app
COPY ./dist/apps/items-service .
ENV PORT=3336
ENV NODE_ENV=production
ENV ACC_DB_HOST=localhost
ENV ACC_DB_PORT=5432
ENV ACC_DB_NAME=accounts
ENV ACC_DB_PASSWORD=asdf
ENV ACC_DB_USER=postgres
EXPOSE ${PORT}
RUN npm install --production
RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express
RUN npm run acc_migration_run
CMD node ./main.js
