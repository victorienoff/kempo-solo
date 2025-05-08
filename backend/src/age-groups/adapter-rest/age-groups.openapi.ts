import { createRoute, z } from "@hono/zod-openapi";

export const AgeGroupRoutes = {
    getAgeGroups: createRoute({
        method: 'get',
        path: '',
        tags: ['Information'],
        summary: 'Get all age groups',
        description: 'Get all age groups',
        responses : {
            200: {
                description: 'Get all age groups',
                content: {
                    'application/json': {
                        schema: z.array(z.object({
                            id: z.number(),
                            name: z.string(),
                            age_min: z.number(),
                            age_max: z.number()
                        }))
                    }
                }
            }
        }
    }),
    getAgeGroupById: createRoute({
        method: 'get',
        path: '/{id}',
        tags: ['Information'],
        summary: 'Get age group by id',
        description: 'Get age group by id',
        request: {
            params: z.object({
                id:  z.coerce.number()
            })
        },
        responses : {
            200: {
                description: 'Get age group by id',
                content: {
                    'application/json': {
                        schema: z.object({
                            id: z.number(),
                            name: z.string(),
                            age_min: z.number(),
                            age_max: z.number()
                        })
                    }
                }
            },
            404: {
                description: 'Age group not found'
            }
        }
    })

}