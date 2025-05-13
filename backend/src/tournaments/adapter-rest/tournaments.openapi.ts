import { createRoute, z } from "@hono/zod-openapi";
import { CategorySchema, CategorySchemaCreate, CategorySchemaUpdate, TournamentSchema } from "./tournaments.schema.ts";
import { EnumRank } from "../../entities/Tournament.entity.ts";
import { CompetitorSchema } from "../../competitors/adapter-rest/competitors.schema.ts";
import { assign } from "@mikro-orm/core";
import { Match } from "../../entities/match.entity.ts";
import { BracketMatchSchema, MatchSchema } from "../../matches/adapter-rest/matches.schema.ts";

export const TournamentsRoutes = {
    me: createRoute({
        method: 'get',
        path: '/me',
        tags: ['Tournaments'],
        summary: 'Get tournament of the user',
        description: 'Get tournament of the user',
        responses: {
            200: {
                description: 'Details of the tournament',
                content: {
                    'application/json': {
                        schema: z.array(TournamentSchema)
                    }
                }
            },
            404: {
                description: 'Tournament not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            }

        }
    }),
    get: createRoute({
        method: 'get',
        path: '/{id}',
        tags: ['Tournaments'],
        summary: 'Get one tournament',
        description: 'Get one tournament by ID',
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: {
            200: {
                description: 'Details of the tournament',
                content: {
                    'application/json': {
                        schema: TournamentSchema
                    }
                }
            },
            404: {
                description: 'Tournament not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            }

        }
    }),

    post: createRoute({
        method: 'post',
        path: '',
        tags: ['Tournaments'],
        summary: 'Create one tournament',
        description: 'Create one tournament',
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: z.object({
                            name: z.string(),
                            rank: z.nativeEnum(EnumRank).optional(),
                            city: z.string().optional(),
                            start_date: z.coerce.date(),
                            end_date: z.coerce.date().optional(),
                            age_group_id: z.coerce.number().optional(),
                            description: z.string()    

                        })
                    }
                }
            }
        },
        headers: new Headers({ 'Content-Type': 'application/json' }),

        responses: {
            201: {
                description: 'Tournament created',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },

        }
    }),

    put: createRoute({
        method: 'put',
        path: '/{id}',
        tags: ['Tournaments'],
        summary: 'Modify one tournament',
        description: 'Modify one tournament',

        headers: new Headers({ 'Content-Type': 'application/json' }),
        request: {
            params: z.object({
                id: z.string().uuid(),

            }),
            body: {
                content: {
                    "application/json": {
                        schema: TournamentSchema
                    }
                }
            }
        },
        responses: {
            201: {
                description: 'Tournament modified',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
            404: {
                description: 'Tournament not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            }

        }
    }),

    list: createRoute({
        method: 'get',
        path: '',
        tags: ['Tournaments'],
        summary: 'Get all tournaments',
        description: 'Get all tournaments',
        security: [],
        request: {
            query: TournamentSchema
        },
        responses: {
            200: {
                description: 'Details of the tournament',
                content: {
                    'application/json': {
                        schema: z.array(TournamentSchema)
                    }
                }
            },
        }
    }),

    delete: createRoute({
        method: 'delete',
        path: '/{id}',
        tags: ['Tournaments'],
        summary: 'Delete one tournament',
        description: 'Delete one tournament by ID',
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: {
            202: {
                description: 'Tournament deleted',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
            404: {
                description: 'Tournament not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            }

        }
    }),
    addCompetitor: createRoute({
        method: 'post',
        path: '/{id}/add-competitor/{competitorId}',
        tags: ['Tournaments'],
        summary: 'Add one competitor on the tournament',
        description: 'Add one competitor on the tournament by competitor ID',
        request: {
            params: z.object({
                id: z.string().uuid(),
                competitorId: z.string().uuid()
            })

        },
        responses: {
            201: {
                description: 'Competitor add',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
            404: {
                description: 'Tournament or Competitor not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
            409: {
                description: 'Competitor already in tournament',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            }

        }
    }),
    deleteCompetitor: createRoute({
        method: 'delete',
        path: '/{id}/delete-competitor/{idCompetitor}',
        tags: ['Tournaments'],
        summary: 'Delete one competitor ',
        description: 'Delete one competitor on the tournament by competitor ID',
        request: {
            params: z.object({
                id: z.string().uuid(),
                idCompetitor: z.string().uuid()
            }),

        },
        responses: {
            202: {
                description: 'Competitor deleted',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
            404: {
                description: 'Tournament or Competitor not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
            409: {
                description: 'Competitor not in tournament',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            }

        }
    }),
    getCompetitors: createRoute({
        method: 'get',
        path: '/{id}/competitors',
        tags: ['Tournaments'],
        summary: 'Get all competitors of a tournament',
        description: 'Get all competitors of a tournament',
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: {
            200: {
                description: 'Details of the competitors',
                content: {
                    'application/json': {
                        schema: z.array(CompetitorSchema)
                    }
                }
            },
            404: {
                description: 'Tournament not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
        }
    }),
    createCategory: createRoute({
        method: 'post',
        path: '/{id}/categories',
        tags: ['Tournaments'],
        summary: 'Create one category',
        description: 'Create one category',
        request: {
            params: z.object({
                id: z.string().uuid()
            }),
            body: {
                content: {
                    "application/json": {
                        schema: CategorySchemaCreate
                    }
                }
            }
        },
        responses: {
            201: {
                description: 'Category created',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
            404: {
                description: 'Tournament not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
        }
    }),
    deleteCategory: createRoute({
        method: 'delete',
        path: '/categories/{id}',
        tags: ['Tournaments'],
        summary: 'Delete one category',
        description: 'Delete one category by ID',
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: {
            202: {
                description: 'Category deleted',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
            404: {
                description: 'Tournament or Category not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            }

        }
    }),
    modifyCategory: createRoute({
        method: 'put',
        path: '/categories/{id}',
        tags: ['Tournaments'],
        summary: 'Modify one category',
        description: 'Modify one category',
        request: {
            params: z.object({
                id: z.string().uuid()
            }),
            body: {
                content: {
                    "application/json": {
                        schema: CategorySchemaUpdate
                    }
                }
            }
        },
        responses: {
            201: {
                description: 'Category modified',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
            404: {
                description: 'Tournament or Category not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            }

        }
    }),

    listCategories: createRoute({
        method: 'get',
        path: '/{id}/categories',
        tags: ['Tournaments'],
        summary: 'Get all categories',
        description: 'Get all categories of the tournament',
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: {
            200: {
                description: 'Details of the categories',
                content: {
                    'application/json': {
                        schema: z.array(CategorySchema)
                    }
                }
            },
            404: {
                description: 'Tournament not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
        }
    }),
    assignCompetitors: createRoute({
        method: 'post',
        path: '/{id}/assign-competitors',
        tags: ['Tournaments'],
        summary: 'Assign competitors to a category',
        description: 'Assign competitors to a category',
        request: {
            params: z.object({
                id: z.string().uuid()
            }),
        },
        responses: {
            200: {
                description: 'Competitors assigned',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
            404: {
                description: 'Tournament or Category not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
        },
    }),
    assignCompetitor: createRoute({
        method: 'post',
        path: '/{id}/assign-competitor/{categoryId}',
        tags: ['Categories'],
        summary: 'Assign one competitor to a category',
        description: 'Assign one competitor to a category',
        request: {
            params: z.object({
                id: z.string().uuid(),
                categoryId: z.string().uuid()
            }),
            body: {
                content: {
                    "application/json": {
                        schema: z.object({
                            competitor_id: z.string().uuid()
                        })
                    }
                }
            }

        },
        responses: {
            200: {
                description: 'Competitor assigned',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
            404: {
                description: 'Tournament or Competitor not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
        },
    }),
    getCategories: createRoute({
        method: 'get',
        path: '/{id}/categories',
        tags: ['Categories'],
        summary: 'Get all categories',
        description: 'Get all categories of the tournament',
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: {
            200: {
                description: 'Details of the categories',
                content: {
                    'application/json': {
                        schema: z.array(CategorySchema)
                    }
                }
            },
            404: {
                description: 'Tournament not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
        }
    }),
    getCategoryCompetitors: createRoute({
        method: 'get',
        path: '/categories/{categoryId}/competitors',
        tags: ['Categories'],
        summary: 'Get all competitors of a category',
        description: 'Get all competitors of a category',
        request: {
            params: z.object({
                categoryId: z.string().uuid()
            })
        },
        responses: {
            200: {
                description: 'Details of the competitors',
                content: {
                    'application/json': {
                        schema: z.array(CompetitorSchema)
                    }
                }
            },
            404: {
                description: 'Category not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
        }
    }),
    startTournament: createRoute({
        method: 'post',
        path: '/{id}/start',
        tags: ['Tournaments'],
        summary: 'Start the tournament',
        description: 'Start the tournament and create the matches',
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: {
            200: {
                description: 'Tournament started',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
            404: {
                description: 'Tournament not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },

        }
    }),
    startRankingPool: createRoute({
        method: 'post',
        path: '/categories/{id}/start-ranking-pool',
        tags: ['Categories'],
        summary: 'Start ranking pool for a competitor',
        description: 'Start ranking pool for a competitor',
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: {
            200: {
                description: 'Ranking pool started',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
            404: {
                description: 'Tournament or Category not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
        }
    }),
    notfinishedMatches: createRoute({
        method: 'get',
        path: '/categories/{id}/not-finished-matches',
        tags: ['Categories'],
        summary: 'Get all not finished matches',
        description: 'Get all not finished matches of the tournament',
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: {
            200: {
                description: 'Details of the not finished matches',
                content: {
                    'application/json': {
                        schema: z.array(MatchSchema)
                    }
                }
            },
            404: {
                description: 'Tournament not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
        }
    }),
    getMatch: createRoute({
        method: 'get',
        path: '/matches/{id}',
        tags: ['Matches'],
        summary: 'Get one match',
        description: 'Get one match by ID',
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: {
            200: {
                description: 'Details of the match',
                content: {
                    'application/json': {
                        schema: MatchSchema
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
            }

        }
    }),
    getMatches: createRoute({
        method: 'get',
        path: '/categories/{id}/matches',
        tags: ['Matches'],
        summary: 'Get all matches of a category',
        description: 'Get all matches of a category',
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: {
            200: {
                description: 'Details of the matches',
                content: {
                    'application/json': {
                        schema: z.array(MatchSchema)
                    }
                }
            },
            404: {
                description: 'Category not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
        }
    }),
    getCategoryResults: createRoute({
        method: 'get',
        path: '/categories/{id}/results',
        tags: ['Categories'],
        summary: 'Get results of a category',
        description: 'Get results of a category',
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: {
            200: {
                description: 'Details of the results',
                content: {
                    'application/json': {
                        schema: z.object({
                            first: z.string().uuid(),
                            second: z.string().uuid(),
                            third: z.string().uuid()
                        })
                    }
                }
            },
            404: {
                description: 'Category not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
        }
    }),
    getBracket: createRoute({
        method: 'get',
        path: '/categories/{id}/bracket',
        tags: ['Matches'],
        summary: 'Get bracket of a category',
        description: 'Get bracket of a category',
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: {
            200: {
                description: 'Details of the bracket',
                content: {
                    'application/json': {
                        schema: BracketMatchSchema
                       }
                       
                    }
            },
            404: {
                description: 'Category not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
        }
    }),
    deleteCompetitorFromCategory: createRoute({
        method: 'delete',
        path: '/categories/{id}/delete-competitor/{competitorId}',
        tags: ['Categories'],
        summary: 'Delete one competitor from a category',
        description: 'Delete one competitor from a category',
        request: {
            params: z.object({
                id: z.string().uuid(),
                competitorId: z.string().uuid()
            })
        },
        responses: {
            200: {
                description: 'Competitor deleted from category',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
            404: {
                description: 'Category or Competitor not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
        }
    }),
    getCompetitorWithoutCategory: createRoute({
        method: 'get',
        path: '/{id}/competitor-without-category',
        tags: ['Tournaments'],
        summary: 'Get all competitors without category',
        description: 'Get all competitors without category',
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: {
            200: {
                description: 'Details of the competitors',
                content: {
                    'application/json': {
                        schema: z.array(CompetitorSchema)
                    }
                }
            },
            404: {
                description: 'Tournament not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
        }
    }),
    getCategory: createRoute({
        method: 'get',
        path: '/categories/{id}',
        tags: ['Categories'],
        summary: 'Get one category',
        description: 'Get one category by ID',
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: {
            200: {
                description: 'Details of the category',
                content: {
                    'application/json': {
                        schema: CategorySchema
                    }
                }
            },
            404: {
                description: 'Category not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            }

        }
    }),




}