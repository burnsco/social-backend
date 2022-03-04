import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import 'dotenv-safe/config';
import { useServer } from 'graphql-ws/lib/use/ws';
import { createServer } from 'http';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { WebSocketServer } from 'ws';
import { initializeDB, initializeExpress, initializeRedis } from './config';
import User from './entities/User';
import { resolversArray } from './resolvers/resolvers';
import type { ApolloContextType } from './types';

async function main(): Promise<void> {
  const { orm } = await initializeDB();

  const { app } = initializeExpress();

  const { redisClient, pubSub } = initializeRedis();

  const corsOptions = {
    origin: '*', // for now at least, for testing purposes,
    // credentials: true,
  };
  app.use(cors(corsOptions));

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

  const serverCleanup = useServer(
    {
      schema,
      onConnect: async ctx => {
        console.log(`Subscriptions connected`);
        console.log(ctx);
      },
      onDisconnect: async ctx => {
        console.log(`Subscriptions disconnected`);
        console.log(ctx);
      },
    },
    wsServer,
  );

  let userId: any;
  let connectedUser: any;

  const apolloServer = new ApolloServer({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
    context: async ({ req, res }: ApolloContextType) => {
      if (req?.session?.userId) {
        userId = req.session.userId;
        connectedUser = await orm.em.findOne(User, { id: userId });
        return {
          em: orm.em.fork(),
          req,
          res,
          redis: redisClient,
        };
      }
      return {
        em: orm.em.fork(),
        req,
        res,
        redis: redisClient,
      };
    },
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });

  const PORT = process.env.PORT || 4000;

  httpServer.listen(PORT, () => {
    console.log(
      `Server is now running on http://localhost:${PORT}${apolloServer.graphqlPath}`,
    );
  });
}

main().catch((err: any) => {
  console.log(err.message);
});
