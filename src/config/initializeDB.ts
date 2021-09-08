import { MikroORM } from "@mikro-orm/core"
import { PostgreSqlDriver } from "@mikro-orm/postgresql/PostgreSqlDriver"

export default async function initializeDB() {
  const orm = await MikroORM.init<PostgreSqlDriver>()

  const migrator = orm.getMigrator()
  const migrations = await migrator.getPendingMigrations()

  if (migrations && migrations.length > 0) {
    await migrator.up()
  }

  return { orm }
}
