import { json } from "stream/consumers";
import { getApp } from "../../api/get-app.ts";
import { RanksRoutes } from "./ranks.openapi.ts";
import { EnumRank } from "../../entities/Tournament.entity.ts";
import { decode } from "hono/jwt";

export function buildRanksRouter() {
    const router = getApp()

    return router.openapi(RanksRoutes.list, (ctx) => {
        
        return ctx.json(Object.values(EnumRank),200)
    })
    
}