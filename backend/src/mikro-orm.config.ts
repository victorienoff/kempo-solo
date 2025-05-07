// mikro-orm.config.ts
import { MikroORM } from '@mikro-orm/core';
import { defineConfig, MySqlDriver } from '@mikro-orm/mysql';
import { Tournament } from './entities/Tournament.entity.ts';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';

// export default {
//   dbName: 'kempo_db',
//   user: 'root',
//   password: '',
//   host: 'localhost',
//   port: 3306, // Port MySQL par défaut
//   entities: [Tournament],
//   entitiesTs: ['./src/entities/*.ts'],
//   driver: MySqlDriver,
//   allowGlobalContext: true,
//   extensions: [ Migrator],
// } as Parameters<typeof MikroORM.init>[0];

export default defineConfig({
  dbName: 'kempo_db_solo',
  user: 'root',
  password: 'secure-password',
  host: 'localhost',
  port: 3306, // Port MySQL par défaut
  entities: [Tournament],
  entitiesTs: ['./src/entities/*.ts'],
  driver: MySqlDriver,
  allowGlobalContext: true,
  extensions: [Migrator,SeedManager],
}) 