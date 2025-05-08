import { createRoute, z } from "@hono/zod-openapi";
import { EnumGender } from "../../entities/weight-category.ts";

export const WeightCategoriesRoutes = {
    getWeightCategories: createRoute({
        method: 'get',
        path: '',
        tags: ['Information'],
        summary: 'Get all weight categories',
        description: 'Get all weight categories',
        responses : {
            200: {
                description: 'Get all weight categories',
                content: {
                    'application/json': {
                        schema: z.array(z.object({
                            id: z.number(),
                            name: z.string(),
                            weight_min: z.number(),
                            weight_max: z.number(),
                            age_group : z.object({
                                id: z.number(),
                                name: z.string(),
                                age_min: z.number(),
                                age_max: z.number()
                            }),
                            gender: z.nativeEnum(EnumGender)
                        }))
                    }
                }
            }
        }
    }),
    getWeightCategoriesById: createRoute({
        method: 'get',
        path: '/{id}',
        tags: ['Information'],
        summary: 'Get weight category by id',
        description: 'Get weight category by id',
        request: {
            params: z.object({
                id:  z.coerce.number()
            })
        },
        responses : {
            200: {
                description: 'Get weight category by id',
                content: {
                    'application/json': {
                        schema: z.array(z.object({
                            id: z.number(),
                            name: z.string(),
                            weight_min: z.number(),
                            weight_max: z.number(),
                            age_group : z.object({
                                id: z.number(),
                                name: z.string(),
                                age_min: z.number(),
                                age_max: z.number()
                            }),
                            gender: z.nativeEnum(EnumGender)
                        }))
                    }
                }
            },
            404: {
                description: 'Weight category not found'
            }
        }
    })

}