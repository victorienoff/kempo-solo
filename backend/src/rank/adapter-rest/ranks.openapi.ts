import { createRoute, z } from "@hono/zod-openapi";
import { EnumRank } from "../../entities/Tournament.entity.ts";

export const RanksRoutes = {
    list: createRoute({
        method: 'get',
        path: '',
        tags: ['Information'],
        summary: 'Get all ranks',
        description: 'Get all ranks',
        responses: {
            200: {
                description: 'All the rank',
                content: {
                    'application/json': {
                        schema: z.nativeEnum(EnumRank).array()
                    }
                }
            },
        }
    })
}