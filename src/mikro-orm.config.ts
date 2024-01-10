import { ReflectMetadataProvider } from '@mikro-orm/core'
import { Migrator } from '@mikro-orm/migrations'
import { PostgreSqlDriver, type Options } from '@mikro-orm/postgresql'
import 'dotenv-safe/config'
import path from 'path'
import { __prod__ } from './common/constants'

const config: Options = {
  driver: PostgreSqlDriver,
  metadataProvider: ReflectMetadataProvider,
  driverOptions: {},
  entities: ['./dist/entities/**/*.js'],
  entitiesTs: ['./src/entities/**/*.ts'],
  migrations: {
    path: path.join(__dirname, './migrations'),
  },
  extensions: [Migrator],
  tsNode: process.env.NODE_DEV === 'true' ? true : false,
  clientUrl: process.env.DB_URL,
  dbName: process.env.DB_NAME,
  allowGlobalContext: true,
  debug: !__prod__,
  seeder: {
    path: './src/seeders',
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}', // how to match seeder files (all .js and .ts files, but not .d.ts)
    emit: 'ts', // seeder generation mode
    fileName: (className: string) => className,
  },
}

export default config
