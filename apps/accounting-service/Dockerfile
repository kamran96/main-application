FROM node:lts-alpine
WORKDIR /app
COPY ./dist/apps/accounting-service .
ENV PORT=3336
ENV NODE_ENV=production
EXPOSE ${PORT}
RUN npm install --production
RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express
RUN npm run acc_migration_run
CMD node ./main.js
