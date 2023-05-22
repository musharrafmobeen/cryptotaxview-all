FROM node:16 AS builder

# Setting Home Directory for containers
WORKDIR /usr/src/app

COPY package*.json ./

## Installing dependencies
RUN npm install

# Copying source code to the container
COPY . .
RUN npm run build
RUN sed -i 's/openssl_conf = default_conf/# openssl_conf = default_conf/g' /etc/ssl/openssl.cnf

CMD ["node","dist/main.js"]
