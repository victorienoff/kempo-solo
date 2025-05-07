import { createRoute, z, type OpenAPIHono } from "@hono/zod-openapi";
import { zValidator } from "@hono/zod-validator";
import { getApp, type AppEnv } from "./get-app.ts";

import { Competitor } from "../entities/Competitor.entity.ts";
import { sign } from "hono/jwt";
import { bearerAuth } from "hono/bearer-auth";
import { getCookie, setCookie } from "hono/cookie";
import { UserSchemaCreate, type UserCreate } from "../competitors/adapter-rest/competitors.schema.ts";
import { register } from "module";






const schemalogin = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(20)
    });


export const LoginRoutes = {
    login : createRoute({
        method: 'post',
        path: '/login',
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
    register : createRoute({
        method: 'post',
        path: '/register',
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
        const em = ctx.get("em") ;
        const competitor = await em.findOne(Competitor, { email });
        if (!competitor) {
            return ctx.json({ error: "Invalid email or password" } as { error: string }, 401);
        }
        if (competitor.password !== password) {
            return ctx.json({ error: "Invalid email or password" }, 401);
        }

        const payload = {
            id : competitor.id,
          };
        
        const secret =  process.env.JWT_SECRET || 'your-secret-key' 
        const token = await sign(payload, secret);
        setCookie(ctx, "token", token);
        return ctx.json({ token } as { token: string }, 200);

        
    })
    .openapi(LoginRoutes.register, async (ctx) => {
        const body = ctx.req.valid("json") as UserCreate;
        const em = ctx.get("em") ;
        const existingCompetitor = await em.findOne(Competitor, { email: body.email });
        if (existingCompetitor) {
            return ctx.json({ error: "Email already exists" } as { error: string }, 401);
        }
    
        const result = em.create(Competitor, { ...body })

        

        await em.persistAndFlush(result);

    ;

        const payload = {
            id : result.id,
          };

        const secret =  process.env.JWT_SECRET || 'your-secret-key' 
        const token = await sign(payload, secret);
        setCookie(ctx, "token", token);
        return ctx.json({ token } as { token: string }, 200)
    })

    
}


