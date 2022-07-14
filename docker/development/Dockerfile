FROM node:16-alpine

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
COPY .env.development .env

RUN yarn build
ENV NODE_ENV development

USER node
EXPOSE 4000

CMD [ "yarn", "start:prod" ]
