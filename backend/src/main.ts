import { serve } from '@hono/node-server';
import { registerAppRoutes } from './api/register-app-routes.ts';
import { MikroORM } from '@mikro-orm/core';
import config from './mikro-orm.config.ts';
import { createHttpApp } from './api/create-http-app.ts';




const orm = await MikroORM.init(config);
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