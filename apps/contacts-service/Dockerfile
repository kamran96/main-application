FROM node:lts-alpine
WORKDIR /app
COPY ./dist/apps/contacts-service .
ENV PORT=3333
ENV MONGO_URI=mongodb+srv://contacts:fYnc4.ZPdz378t4@cluster0.hiwqy.mongodb.net/contacts?retryWrites=true&w=majority
ENV JWT_SECRET=alalsdflasjlf343424
ENV EXPIRES=12
EXPOSE ${PORT}
RUN npm install --production
RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express
CMD node ./main.js