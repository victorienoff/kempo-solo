import { serve } from '@hono/node-server';
import { registerAppRoutes } from './api/register-app-routes.ts';
import { MikroORM } from '@mikro-orm/core';
import config from './mikro-orm.config.ts';
import { createHttpApp } from './api/create-http-app.ts';

// Debug: Log database configuration
console.log('🔍 Database configuration:');
console.log('MYSQL_URL:', process.env.MYSQL_URL ? 'SET' : 'NOT SET');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('MYSQL_HOST:', process.env.MYSQL_HOST || 'NOT SET');
console.log('MYSQL_PORT:', process.env.MYSQL_PORT || 'NOT SET');
console.log('MYSQL_DATABASE:', process.env.MYSQL_DATABASE || 'NOT SET');
console.log('DB_HOST:', process.env.DB_HOST || 'localhost');
console.log('DB_PORT:', process.env.DB_PORT || '3306');
console.log('DB_NAME:', process.env.DB_NAME || 'kempo_db_solo');

// Vérifier si la configuration de base de données est disponible
if (!process.env.MYSQL_URL && process.env.NODE_ENV === 'production') {
  console.error('❌ MYSQL_URL is required in production environment');
  console.error('💡 Please add a MySQL database to your Railway project');
  process.exit(1);
}

console.log('🔄 Initializing MikroORM...');
const orm = await MikroORM.init(config);
console.log('✅ MikroORM initialized successfully');

// Run migrations automatically on startup (production only)
if (process.env.NODE_ENV === 'production') {
  console.log('🚀 Running database migrations...');
  const migrator = orm.getMigrator();
  await migrator.up();
  console.log('✅ Database migrations completed');
} else {
  console.log('🔧 Development mode - skipping automatic migrations');
}
const app = registerAppRoutes(createHttpApp({ em: orm.em }));

const port = parseInt(process.env.PORT || '3000');

serve({
  fetch: app.fetch,
  port: port
}, (info) => {
  console.log(`🚀 Server is running on http://localhost:${info.port}`)
  console.log(`📚 API documentation is available on http://localhost:${info.port}/docs`)
  console.log(`🗄️ Database: ${config.dbName || 'Connected via DATABASE_URL'}`)
})