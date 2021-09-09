# base image contains the dependencies and no application code
FROM node:16-alpine as base  

# prod image inherits from base and adds application code
FROM base as prod 

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn install --production

COPY . .
COPY .env.production .env

RUN yarn build

ENV NODE_ENV production

EXPOSE 8080
CMD [ "node", "dist/index.js" ]
USER node