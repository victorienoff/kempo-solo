// mikro-orm.config.ts
import { MikroORM } from '@mikro-orm/core';
import { defineConfig } from '@mikro-orm/postgresql';
import { Tournament } from './entities/Tournament.entity.ts';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';

export default defineConfig({
  dynamicImportProvider: id => import(id),
  // Configuration pour PostgreSQL (Railway)
  clientUrl: process.env.DATABASE_URL,
  // Fallback pour développement local avec MySQL
  dbName: process.env.DB_NAME || 'kempo_db_solo',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
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