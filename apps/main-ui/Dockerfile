FROM node:lts-alpine as build

WORKDIR /app
COPY ./nginx/nginx.conf .
COPY ./dist/apps/main-ui .

FROM node:lts-alpine
FROM nginx:alpine

ENV NODE_ENV='production' \
    REACT_APP_ENCRIPTION_KEY='@@qW4hdejazkarimhunzai!!isEjoo' \
    REACT_APP_REGISTER_KEY='@@Inv@&&oldPhunar'\
    PORT=80

WORKDIR /home/node/app

# change permissions to the node_modules folder

COPY --from=build /app /usr/share/nginx/html
COPY ./dist/apps/main-ui /home/node/app

# needed this to make React Router work properly 
# RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE ${PORT}
CMD ["nginx", "-g", "daemon off;"]

