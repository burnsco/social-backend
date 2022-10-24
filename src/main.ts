import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { json } from 'body-parser'
import cors from 'cors'
import 'dotenv-safe/config'
import { useServer } from 'graphql-ws/lib/use/ws'
import { createServer } from 'http'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { WebSocketServer } from 'ws'
import { initializeDB, initializeExpress, initializeRedis } from './config'
import { resolversArray } from './resolvers/resolvers'

// todo fix the user connection so it goes online/offline properly
// todo make it easier to test on apollo studio (user cookie? token? )
// todo possible make it so that everything is a sub, or more things at least

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
        console.log(ctx)
        console.log(`Subscriptions connected`)
      },
      onDisconnect: async ctx => {
        console.log(`Subscriptions disconnected`)
      },
    },
    wsServer,
  )
  const apolloServer = new ApolloServer({
    schema,
    plugins: [
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
      origin: ['https://studio.apollographql.com', 'http://localhost:3000'],
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
