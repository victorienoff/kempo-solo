import { createRoute, z, type OpenAPIHono } from "@hono/zod-openapi";
import { zValidator } from "@hono/zod-validator";
import { getApp, type AppEnv } from "./get-app.ts";

import { Competitor, EnumRole } from "../entities/Competitor.entity.ts";
import { sign } from "hono/jwt";
import { bearerAuth } from "hono/bearer-auth";
import { getCookie, setCookie } from "hono/cookie";
import { UserSchemaCreate, type UserCreate } from "../competitors/adapter-rest/competitors.schema.ts";
import { register } from "module";
import bcrypt from "bcryptjs";
import { Right } from "../entities/right.entity.ts";

const schemalogin = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(20)
});

export const LoginRoutes = {
    login: createRoute({
        method: 'post',
        path: '/login',
        tags: ['Athentication'],
        summary: 'Login',
        description: 'Login with email and password',
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: schemalogin
                    }
                }
            },
        },
        responses: {
            200: {
                description: 'Login successful',
                content: {
                    'application/json': {
                        schema: z.object({
                            token: z.string()
                        })
                    }
                }
            },
            401: {
                description: 'Invalid email or password',
                content: {
                    "application/json": {
                        schema: z.object({
                            error: z.string()
                        })
                    }
                }
            }
        }
    }),
    register: createRoute({
        method: 'post',
        path: '/register',
        tags: ['Athentication'],
        summary: 'Register',
        description: 'Register with email and password',
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: UserSchemaCreate
                    }
                }
            },
        },
        responses: {
            200: {
                description: 'Register successful',
                content: {
                    'application/json': {
                        schema: z.object({
                            token: z.string()
                        })
                    }
                }
            },
            401: {
                description: 'Invalid email or password',
                content: {
                    "application/json": {
                        schema: z.object({
                            error: z.string()
                        })
                    }
                }
            }
        }
    })
}

export function buildLoginRouter() {
    const router = getApp()

    return router.openapi(LoginRoutes.login, async (ctx) => {
        const { email, password } = ctx.req.valid("json") as { email: string; password: string };
        const em = ctx.get("em");
        const competitor = await em.findOne(Competitor, { email });
        if (!competitor) {
            return ctx.json({ error: "Invalid email" } as { error: string }, 401);
        }
        const same = await bcrypt.compare(password, competitor.password);
        if (!same) {
            return ctx.json({ error: "Invalid password" }, 401);
        }

        const right = await em.find(Right, { role: { $like: `%${competitor.role}%` } });

        

        const payload = {
            id: competitor.id,
            role: competitor.role,
            rights : right.map((r) => r.id)
        };

        const secret = process.env.JWT_SECRET || 'your-secret-key'
        const token = await sign(payload, secret);
        setCookie(ctx, "token", token);
        return ctx.json({ token } as { token: string }, 200);
    })
        .openapi(LoginRoutes.register, async (ctx) => {
            const body = ctx.req.valid("json") as UserCreate;
            const em = ctx.get("em");
            const existingCompetitor = await em.findOne(Competitor, { email: body.email });
            if (existingCompetitor) {
                return ctx.json({ error: "Email already exists" } as { error: string }, 401);
            }

            const hashedPassword = await bcrypt.hash(body.password, 10);

           

            const result = em.create(Competitor, {
                ...body,
                password: hashedPassword,
                role: EnumRole.COMPETITOR,
            })



            await em.persistAndFlush(result);

            const right = await em.find(Right, { role: { $like: `%${EnumRole.COMPETITOR}%` } });

            const payload = {
                id: result.id,
                role: result.role,
                rights : right.map((r) => r.id)
            };

            const secret = process.env.JWT_SECRET || 'your-secret-key'
            const token = await sign(payload, secret);
            setCookie(ctx, "token", token);
            return ctx.json({ token } as { token: string }, 200)
        })
}


