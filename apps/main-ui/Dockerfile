FROM node:lts-alpine as build

WORKDIR /app
COPY ./nginx/nginx.conf .
COPY ./dist/apps/main-ui .
COPY ./ssl/generate-ssl.sh .

FROM node:lts-alpine
FROM nginx:alpine

RUN apk add dumb-init && apk add \
    openssl \
    bash

ENV NODE_ENV='production' \
    REACT_APP_ENCRIPTION_KEY='@@qW4hdejazkarimhunzai!!isEjoo' \
    REACT_APP_REGISTER_KEY='@@Inv@&&oldPhunar'\
    PORT=80


# change permissions to the node_modules folder
COPY --from=build /app /usr/share/nginx/html
# COPY --chown=node:node --from=build /app/generate-ssl.sh /usr/share/nginx/html/generate-ssl.sh


# needed this to make React Router work properly 
RUN rm /etc/nginx/conf.d/default.conf
# RUN chmod +x /usr/share/nginx/html/generate-ssl.sh
# RUN cd /usr/share/nginx/html/ && ./generate-ssl.sh
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE ${PORT}
CMD ["nginx", "-g", "daemon off;"]

