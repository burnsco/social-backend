FROM node:16

WORKDIR /usr/src/app
COPY package.json  ./
RUN npm install
COPY . .
COPY .env.production .env
RUN npm run build
ENV NODE_ENV production
USER node
EXPOSE 4000

CMD [ "yarn", "prod" ]