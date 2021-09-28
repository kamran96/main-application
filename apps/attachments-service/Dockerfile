FROM node:lts-alpine
WORKDIR /app
COPY ./dist/apps/items-service .
ENV PORT=3338
ENV MONGO_URI=mongodb+srv://contacts:fYnc4.ZPdz378t4@cluster0.hiwqy.mongodb.net/attachments?retryWrites=true&w=majority
ENV JWT_SECRET=alalsdflasjlf343424
ENV EXPIRES=12
ENV NODE_ENV=production
EXPOSE ${PORT}
RUN npm install --production
RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express
CMD node ./main.js