import { serve } from '@hono/node-server'
import { registerAppRoutes } from './api/register-app-routes.ts'
import { getApp } from './api/get-app.ts'
import { EntityManager } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/core';
import config from './mikro-orm.config.ts';
import { Tournament } from './entities/Tournament.entity.ts';
import { contextStorage } from 'hono/context-storage';
import { cors } from 'hono/cors';
import { logger } from "hono/logger";
import { bearerAuth } from "hono/bearer-auth";
import { verify } from "hono/jwt";




const orm = await MikroORM.init(config);
const em = orm.em;

const httpApp = getApp();


httpApp.use(contextStorage())

httpApp.use(async (c, next) => {
  c.set('em', em)
  await next()
})

httpApp.use(logger())

httpApp.use(cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Authorization'],
}))


httpApp.use('/api/*', bearerAuth({
  verifyToken: async (token, ctx) => {
    try {
      const payload = await verify(token, process.env.JWT_SECRET || 'your-secret-key');
      ctx.set("authtoken", token);
      ctx.set("user", payload); 
      return true;
    } catch (e) {
      return false;
    }
  },
}));







const app = registerAppRoutes(httpApp)



serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
  console.log(`API documentation is available on http://localhost:${info.port}/docs`)
})