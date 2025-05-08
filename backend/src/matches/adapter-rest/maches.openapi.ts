import { createRoute, z } from "@hono/zod-openapi";
import { CompetitorSchema } from "../../competitors/adapter-rest/competitors.schema.ts";

export const MatchesRoutes = {
    setResult: createRoute({
        method: 'post',
        path: '/{id}',
        tags: ['Matches'],
        summary: 'Set the result of a match',
        description: 'Set the result of a match',
        request: {
            params: z.object({
                id: z.string().uuid()
            }),
            body: {
                content: {
                    'application/json': {
                        schema: z.object({
                            score1: z.number(),
                            score2: z.number(),
                            keikuka1: z.number(),
                            keikuka2: z.number(),
                            winner: z.string().uuid().optional(),
                        })
                    }
                }
            },
        },
        responses: {
            200: {
                description: 'Match result updated',
                content: {
                    'application/json': {
                        schema: z.string().nullable()
                    }
                }
            },
            404: {
                description: 'Match not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
        }
    }),
}
