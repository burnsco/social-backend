import cors from 'cors'
import 'dotenv-safe/config'
import express from 'express'
import session from 'express-session'
import 'reflect-metadata'
import { COOKIE_NAME } from '../common/constants'
import initializeRedis from './redisConfig'

const APOLLO_STUDIO_URL = 'https://studio.apollographql.com'

export default function initializeExpress() {
  const { redisStore, redisClient } = initializeRedis()

  const app = express()

  app.set('trust proxy', process.env.NODE_ENV !== 'production')
  app.use(
    cors({
      origin: [
        'https://studio.apollographql.com',
        'https://sandbox.embed.apollographql.com',
        'http://localhost:3000',
        'http://localhost:3002',
        'https://social.coreyburns.dev',
        'https://social.coreyburns.dev:3000',
      ],
      credentials: true,
    }),
  )
  app.use(
    session({
      name: COOKIE_NAME,
      store: redisStore,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        sameSite: 'lax',
        secure: 'auto',
        // sameSite: 'none',
        // secure: true,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    }),
  )

  return { app }
}
