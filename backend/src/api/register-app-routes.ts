import type { OpenAPIHono } from "@hono/zod-openapi";
import { buildTournamentsRouter } from "../tournaments/adapter-rest/tournaments.router.ts";
import type { AppEnv } from "./get-app.ts";
import { apiReference } from "@scalar/hono-api-reference";
import { buildRanksRouter } from "../rank/adapter-rest/ranks.router.ts";
import { buildCompetitorsRouter } from "../competitors/adapter-rest/competitors.router.ts";
import { buildAgeGroupsRouter } from "../age-groups/adapter-rest/age-groups.router.ts";
import { buildWeightCategoriesRouter } from "../weight-categories/adapter-rest/weight-categories.router.ts";
import { buildMatchesRouter } from "../matches/adapter-rest/matches.router.ts";
import { buildLoginRouter } from "./login.ts";

export const registerAppRoutes = (baseApp: OpenAPIHono<AppEnv>) => {
    let app = baseApp.route('/api/tournaments', buildTournamentsRouter())
    app = baseApp.route('', buildLoginRouter())
    app = baseApp.route('/api/ranks',buildRanksRouter())
    app = baseApp.route('/api/competitors',buildCompetitorsRouter())
    app = baseApp.route('/api/age-groups', buildAgeGroupsRouter())
    app = baseApp.route('/api/weight-categories', buildWeightCategoriesRouter())
    app = baseApp.route('/api/matches', buildMatchesRouter())
    

    



    app.doc('/doc', {
        openapi: '3.0.0',
        info: {
            version: '1.0.0',
            title: 'Kenpo API Documentation Raw',
        },
    })
    
    app.get(
        '/docs',
        apiReference({
          url: '/doc',
        }),
      )



    return app
}