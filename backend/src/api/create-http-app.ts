import { bearerAuth } from "hono/bearer-auth";
import { getApp } from "./get-app.ts";
import { verify } from "hono/jwt";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { contextStorage } from "hono/context-storage";
import type { SqlEntityManager } from "@mikro-orm/mysql";

interface CreateHttpAppParams {
    em?: SqlEntityManager;
    useLogger?: boolean;
    useAuth?: boolean;
}

export function createHttpApp(params: CreateHttpAppParams) {
    const { em, useLogger = true, useAuth = true } = params;

    const app = getApp();

    app.use(contextStorage())

    if (em) {
        app.use(async (c, next) => {
            c.set('em', em);
            await next();
        });
    }

    if (useLogger) {
        app.use(logger());
    }

    app.use(cors({
        origin: '*',
        allowHeaders: ['Content-Type', 'Authorization'],
        exposeHeaders: ['Authorization'],
    }));

    if (useAuth) {
        app.use('/api/*', async (c, next) => {

            if (c.req.method === 'GET' && (c.req.path === '/api/tournaments' || c.req.path === '/api/ranks')) {
                await next();
                return;
            }
            return bearerAuth({
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
            })(c, next);
        });
    }
    return app;
}