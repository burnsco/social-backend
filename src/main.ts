import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import 'dotenv-safe/config';
import { useServer } from 'graphql-ws/lib/use/ws';
import { createServer } from 'http';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { WebSocketServer } from 'ws';
import { initializeDB, initializeExpress, initializeRedis } from './config';
import { resolversArray } from './resolvers/resolvers';
import type { ApolloContextType } from './types';

async function main(): Promise<void> {
  const { orm } = await initializeDB();

  const { app } = initializeExpress();
  const { redisClient, pubSub } = initializeRedis();

  const schema = await buildSchema({
    resolvers: resolversArray,
    validate: false,
    pubSub,
  });

  const httpServer = createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/subscriptions',
  });

  const apolloServer = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              wsServer.close(() => {
                console.log('websocket server closing');
              });
            },
          };
        },
      },
    ],
    context: async ({ req, res }: ApolloContextType) => {
      return {
        em: orm.em.fork(),
        req,
        res,
        redis: redisClient,
      };
    },
  });

  await apolloServer.start();

  const corsOptions = {
    credentials: true,
    origin: process.env.CORS_ORIGIN,
  };

  apolloServer.applyMiddleware({ app, cors: corsOptions });

  const PORT = process.env.PORT || 4000;

  httpServer.listen(PORT, () => {
    useServer(
      {
        schema,
        context: async (ctx, msg, args) => {
          return {
            em: orm.em.fork(),
          };
        },
        onConnect: async ctx => {
          console.log(`Subscriptions connected`);
        },
        onDisconnect: async ctx => {
          console.log(`Subscriptions disconnected`);
        },
      },
      wsServer,
    );
    console.log(
      `Server is now running on http://localhost:${PORT}${apolloServer.graphqlPath}`,
    );
  });
}

main().catch((err: any) => {
  console.log(err.message);
});
