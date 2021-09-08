import connectRedis from "connect-redis"
import "dotenv-safe/config"
import session from "express-session"
import { RedisPubSub } from "graphql-redis-subscriptions"
import Redis from "ioredis"
import "reflect-metadata"

const REDIS_PORT = 6379

const options: Redis.RedisOptions = {
  host: process.env.REDIS_HOST,
  port: REDIS_PORT,
  retryStrategy: (times: number) => Math.max(times * 100, 3000)
}

export default function initializeRedis() {
  const redisStore = connectRedis(session)
  const redisClient = new Redis(process.env.REDIS_URL)

  const pubSub = new RedisPubSub({
    publisher: new Redis(options),
    subscriber: new Redis(options)
  })

  return {
    redisStore,
    redisClient,
    pubSub
  }
}
