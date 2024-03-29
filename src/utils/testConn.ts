import type { EntityManager } from '@mikro-orm/core'
import { MikroORM, ReflectMetadataProvider } from '@mikro-orm/core'
import { PostgreSqlDriver } from '@mikro-orm/postgresql/PostgreSqlDriver'
import path from 'path'
import { Category, Comment, Message, Post, User, Vote } from '../entities'
import PrivateMessage from '../entities/PrivateMessage'

export const BASE_DIR = __dirname

export async function testConnection() {
  const orm = await MikroORM.init<PostgreSqlDriver>({
    metadataProvider: ReflectMetadataProvider,
    migrations: {
      path: path.join(__dirname, '../migrations'),
    },
    dbName: 'social-testing',
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    entities: [Category, User, Post, Comment, Vote, Message, PrivateMessage],
    baseDir: BASE_DIR,
    driver: PostgreSqlDriver,
    debug: true,
    logger: i => i,
  })

  return orm
}

export async function wipeDatabase(em: EntityManager) {
  await em.nativeDelete(Category, {})
  await em.nativeDelete(Vote, {})
  await em.nativeDelete(User, {})
  await em.nativeDelete(Message, {})
  await em.nativeDelete(PrivateMessage, {})
  await em.nativeDelete(User, {})
  await em.nativeDelete(Post, {})
  await em.nativeDelete(Comment, {})

  em.clear()
}
