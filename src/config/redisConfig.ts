import connectRedis from 'connect-redis';
import 'dotenv-safe/config';
import session from 'express-session';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import 'reflect-metadata';

const options = {
  host: process.env.REDIS_HOST,
  port: 6379,
  retryStrategy: (times: number) => Math.max(times * 100, 3000),
};

export default function initializeRedis() {
  const redisStore = connectRedis(session);
  const redisClient = new Redis(options);

  const pubSub = new RedisPubSub({
    publisher: new Redis(options),
    subscriber: new Redis(options),
  });

  return {
    redisStore,
    redisClient,
    pubSub,
  };
}
