FROM node:lts-alpine
WORKDIR /app
COPY ./dist/apps/items-service .
ENV PORT=3335
ENV POSTMARK_TOKEN=c2afabc2-c521-4a0f-9957-dbba1be9f943
ENV NODE_ENV=production
EXPOSE ${PORT}
RUN npm install --production
RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express
CMD node ./main.js