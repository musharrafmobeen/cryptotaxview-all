FROM node:16 AS builder

# Setting Home Directory for containers
WORKDIR /usr/src/app

COPY package*.json ./

## Installing dependencies
RUN npm install

# Copying source code to the container
COPY . .
RUN npm run build


FROM nginx
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
COPY  nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
COPY change_baseURL_in_build.sh  .
EXPOSE 80
