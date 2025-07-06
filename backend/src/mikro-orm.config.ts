// mikro-orm.config.ts
import { MikroORM } from '@mikro-orm/core';
import { defineConfig } from '@mikro-orm/mysql';
import { Tournament } from './entities/Tournament.entity.ts';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';

export default defineConfig({
  dynamicImportProvider: id => import(id),
  // Configuration pour MySQL (Railway) - essaie plusieurs variables
  ...(process.env.MYSQL_URL || process.env.DATABASE_URL
    ? { 
        clientUrl: process.env.MYSQL_URL || process.env.DATABASE_URL,
        debug: process.env.NODE_ENV !== 'production'
      }
    : process.env.MYSQL_HOST
    ? {
        // Variables séparées Railway MySQL
        host: process.env.MYSQL_HOST,
        port: parseInt(process.env.MYSQL_PORT || '3306'),
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        dbName: process.env.MYSQL_DATABASE,
        debug: process.env.NODE_ENV !== 'production'
      }
    : {
        // Fallback pour développement local avec MySQL
        dbName: process.env.DB_NAME || 'kempo_db_solo',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        debug: true
      }
  ),
  entities: ['./src/entities/*.js '],
  entitiesTs: ['./src/entities/*.ts'],
  allowGlobalContext: true,
  extensions: [Migrator, SeedManager],
  migrations: {
    path: './src/migrations',
    pathTs: './src/migrations',
  },
  seeder: {
    path: './src/seeders',
    pathTs: './src/seeders',
  },
}) 