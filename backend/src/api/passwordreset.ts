import { createRoute, z } from "@hono/zod-openapi";
import path from "path";
import { getApp } from "./get-app.ts";
import { decode } from "hono/jwt";
import { Competitor } from "../entities/Competitor.entity.ts";
import bcrypt from "bcryptjs";

export const PasswordResetRoutes = {
    passwordReset: createRoute({
        method: 'post',
        path: '/password-reset/{password}',
        tags: ['PasswordReset'],
        summary: 'Password reset',
        description: 'Password reset with email',
        request: {
            params: z.object({
                password: z.string().min(8).max(20),
            }),
        },
        responses: {
            200: {
                description: 'Password reset successful',
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                        }),
                    },
                },
            },
            400: {
                description: 'Invalid token',
                content: {
                    'application/json': {
                        schema: z.object({
                            error: z.string(),
                        }),
                    },
                },
            },
            404: {
                description: 'Competitor not found',
                content: {
                    'application/json': {
                        schema: z.object({
                            error: z.string(),
                        }),
                    },
                },
            },
        }
    
    })
};


export function buildPasswordResetRouter() {
    const router = getApp()

    return router.openapi(PasswordResetRoutes.passwordReset, async (ctx) => {
        const token = ctx.get("authtoken")
        const payload = decode(token)
        const { password } = ctx.req.valid('param')

        if (!password) {
            return ctx.json({ error: 'Password is required' as string }, 400)
        }

        const em = ctx.get("em")

        const competitor = await em.findOne(Competitor, { id: payload.payload.id as string })
        if (competitor == null) {
            return ctx.json({ error: 'Competitor not found' as string }, 404)
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        
        competitor.password = hashedPassword
        await em.persistAndFlush(competitor)

        return ctx.json({ message: 'Password reset successful' as string }, 200)
    })
}

            