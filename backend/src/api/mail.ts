import { createRoute, z } from "@hono/zod-openapi";
import path from "path";
import { getApp } from "./get-app.ts";
import { Competitor } from "../entities/Competitor.entity.ts";
import { sign } from "hono/jwt";
import { setCookie } from "hono/cookie";
import Mailjet from "node-mailjet";

export const MailRoutes = {
    send: createRoute({
        method: 'post',
        path: '/send/{email}',
        tags: ['Mail'],
        summary: 'Send email',
        description: 'Send email with token',
        request: {
            params: z.object({
                email: z.string().email()
            })
        },
        responses : {
            200: {
                description: 'Email sent',
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string()
                        })
                    }
                }
            },
            400: {
                description: 'Invalid email',
                content: {
                    "application/json": {
                        schema: z.object({
                            error: z.string()
                        })
                    }
                }
            },
            500: {
                description: 'Internal server error',
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
};

export function buildMailRouter() {
    const router = getApp()

    return router.openapi(MailRoutes.send, async (ctx) => {
        const { email } = ctx.req.valid('param')


        if (!email) {
            return ctx.json({ error: 'Email is required' }, 400)
        }

        const em = ctx.get("em")
        const competitor = await em.findOne(Competitor, { email })
        if (!competitor) {
            return ctx.json({ error: 'Email not found' }, 400)
        }
        const payload = {
            id : competitor.id,
            role : competitor.role
        };
        
        const secret =  process.env.JWT_SECRET || 'your-secret-key' 
        const token = await sign(payload, secret);
        setCookie(ctx, "token", token);

        const mailjet =  Mailjet.Client.apiConnect(
            "142305a29388c925de05370845e625e1",
            "490a96f9d8bf146a9d1e2bda481f65a0"
        );
        try {
            const result = await mailjet.post('send', { version: 'v3.1' }).request({
                Messages: [
                    {
                        From: {
                            Email: 'victorien.los@gmail.com',
                            Name: 'Me',
                        },
                        To: [
                            {
                                Email: competitor.email,
                                Name: 'You',
                            },
                        ],
                        Subject: 'Réinitialisation de votre mot de passe',
                        TextPart: 'Greetings from Mailjet!',
                        HTMLPart:
                            '<h3>  welcome to <a href=" http://localhost:3001/passwordreset/'+token+'">Mailjet</a>!</h3><br />May the delivery force be with you!',
                    },
                ],
            });
            console.log(result.body);
            return ctx.json({ message: 'Email sent' }, 200);
        } catch (err) {
            console.error(err);
            return ctx.json({ error: 'Internal server error' }, 500);
        }

    })
}
    
