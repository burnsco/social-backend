import type { MikroORM } from '@mikro-orm/core';
import { ReflectMetadataProvider } from '@mikro-orm/core';
import 'dotenv-safe/config';
import path from 'path';
import { __prod__ } from './common/constants';

export default {
  metadataProvider: ReflectMetadataProvider,
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: ['./dist/entities/**/*.js'],
  entitiesTs: ['./src/entities/**/*.ts'],
  tsNode: process.env.NODE_DEV === 'true' ? true : false,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_DBNAME,
  allowGlobalContext: true,
  type: 'postgresql',
  debug: !__prod__,
  seeder: {
    path: './src/seeders',
  },
} as Parameters<typeof MikroORM.init>[0];
