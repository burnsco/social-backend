import cors from 'cors';
import 'dotenv-safe/config';
import express from 'express';
import session from 'express-session';
import 'reflect-metadata';
import { COOKIE_NAME, __prod__ } from '../common/constants';
import initializeRedis from './redisConfig';

export default function initializeExpress() {
  const { redisStore, redisClient } = initializeRedis();

  const app = express();

  const corsOrigin = 'https://studio.apollographql.com';

  app.set('trust proxy', 1);
  app.use(
    cors({
      origin: '*',
      credentials: true,
    }),
  );
  app.use(
    session({
      name: COOKIE_NAME,
      store: new redisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: 'lax',
        secure: __prod__,
        domain: __prod__
          ? '*.coreyburns.dev' ||
            'localhost' ||
            'https://studio.apollographql.com'
          : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    }),
  );

  return { app };
}
