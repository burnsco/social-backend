import { ApolloServer } from "apollo-server-express"
import "dotenv-safe/config"
import http from "http"
import "reflect-metadata"
import { buildSchema } from "type-graphql"
import { initializeDB, initializeExpress, initializeRedis } from "./config"
import { User } from "./entities"
import { resolversArray } from "./resolvers/resolvers"
import { ApolloContextType } from "./types"
import { wipeDatabase } from "./utils"

async function main(): Promise<void> {
  const { orm } = await initializeDB()
  await wipeDatabase(orm.em)
  const { app } = initializeExpress()
  const { redisClient, pubSub } = initializeRedis()

  let userId: any

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: resolversArray,
      validate: false,
      pubSub
    }),
    context: async ({ req, res }: ApolloContextType) => {
      if (req && req.session && req.session.userId) {
        userId = req.session.userId
        return {
          em: orm.em.fork(),
          req,
          res,
          redis: redisClient
        }
      }
      return {
        em: orm.em.fork(),
        req,
        res,
        redis: redisClient
      }
    },
    subscriptions: {
      path: "/subscriptions",
      onConnect: async () => {
        try {
          if (!userId) {
            console.log(`GUEST has connected to subscription server`)
            return
          }
          const connectedUser = await orm.em.findOne(User, { id: userId })
          if (!connectedUser) {
            return
          }
          connectedUser.online = true
          await orm.em.flush()

          console.log(
            `${connectedUser.username} has connected to subscription server`
          )
        } catch (ex) {
          return ex
        }
      },
      onDisconnect: async () => {
        try {
          if (!userId) {
            console.log(`GUEST has connected to subscription server`)
            return
          }
          const connectedUser = await orm.em.findOne(User, { id: userId })
          if (!connectedUser) {
            return
          }
          connectedUser.online = false
          await orm.em.flush()

          console.log(
            `${connectedUser.username} has disconnected from subscription server`
          )
        } catch (ex) {
          return ex
        }
      }
    }
  })

  server.applyMiddleware({ app, cors: false })

  const httpServer = http.createServer(app)

  server.installSubscriptionHandlers(httpServer)

  httpServer.listen(process.env.PORT, () => {
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
    )
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${process.env.PORT}${server.subscriptionsPath}`
    )
  })
}

main().catch((err: any) => {
  console.log(err.message)
})
