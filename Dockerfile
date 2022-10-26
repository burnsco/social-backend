FROM node:16

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
COPY .env.production .env
RUN yarn build
ENV NODE_ENV production
USER node
EXPOSE 4000

CMD [ "yarn", "start:prod" ]