FROM node:20

WORKDIR /usr/src/app
COPY package.json  ./
RUN pnpm install
COPY . .
COPY .env.production .env
RUN pnpm run build
ENV NODE_ENV production
USER node
EXPOSE 4000

CMD [ "pnpm run", "prod" ]
