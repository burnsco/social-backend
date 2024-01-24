import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default'
import cors from 'cors'
import 'dotenv-safe/config'
import { json } from 'express'
import { useServer } from 'graphql-ws/lib/use/ws'
import { createServer } from 'http'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { WebSocketServer } from 'ws'
import { initializeDB, initializeExpress, initializeRedis } from './config'
import User from './entities/User'
import { resolversArray } from './resolvers/resolvers'

async function main(): Promise<void> {
  const { orm } = await initializeDB()
  const { app } = initializeExpress()
  const { redisClient, pubSub } = initializeRedis()

  const schema = await buildSchema({
    resolvers: resolversArray,
    validate: false,
    pubSub,
  })

  const httpServer = createServer(app)
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/subscriptions',
  })

  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx, msg, args) => {
        return {
          em: orm.em.fork(),
        }
      },
      onConnect: async ctx => {
        console.log(`Subscriptions CONNECTED`)

        console.log(ctx.connectionParams?.Authorization)

        if (ctx.connectionParams?.Authorization) {
          const userId = ctx.connectionParams.Authorization
          const user = await orm.em.findOne(User, { id: userId })

          if (user) {
            user.online = true
            console.log(`User ${user.username} is now ONLINE`)
            await orm.em.flush()
          }
        }
      },
      onDisconnect: async ctx => {
        console.log(`Subscriptions DISCONNECTED`)

        if (ctx.connectionParams?.Authorization) {
          const userId = ctx.connectionParams.Authorization
          const user = await orm.em.findOne(User, { id: userId })

          if (user) {
            user.online = false
            console.log(`User ${user.username} is now OFFLINE`)
            await orm.em.flush()
          }
        }
      },
    },
    wsServer,
  )

  const apolloServer = new ApolloServer({
    schema,
    plugins: [
      // Install a landing page plugin based on NODE_ENV
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageProductionDefault({
            footer: false,
          })
        : ApolloServerPluginLandingPageLocalDefault({
            footer: false,
            includeCookies: true,
          }),
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })
  await apolloServer.start()

  app.use(
    '/graphql',
    cors({
      credentials: true,
      origin: [
        'http://localhost:3000',
        'http://localhost:3002',
        'http://social.coreyburns.dev',
        'https://social.coreyburns.dev',
        'http://social.coreyburns.dev:3000',
        'https://social.coreyburns.dev:3000',
      ],
    }),
    json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => {
        return {
          em: orm.em.fork(),
          req,
          res,
          redis: redisClient,
        }
      },
    }),
  )
  httpServer.listen(process.env.PORT || 4000, () => {
    console.log(
      `Server is now running on http://localhost:${process.env.PORT}/graphql`,
    )
  })
}
main().catch((err: any) => {
  console.warn(err.message)
})
