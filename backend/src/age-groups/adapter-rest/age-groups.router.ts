import { getApp } from "../../api/get-app.ts";
import { AgeGroup } from "../../entities/age-group.entity.ts";
import { AgeGroupRoutes } from "./age-groups.openapi.ts";

export function buildAgeGroupsRouter() {
    const router = getApp()

    return router.openapi(AgeGroupRoutes.getAgeGroups, async (ctx) => {
        const em = ctx.get("em");
        const ageGroups = await em.find(AgeGroup, {});
        return ctx.json(ageGroups,200)
    })

    .openapi(AgeGroupRoutes.getAgeGroupById, async (ctx) => {
        const { id } = ctx.req.valid('param')
        const em = ctx.get("em")
        const result = await em.findOne(AgeGroup, { id })
        if (result == null) {
            return ctx.text("Not found", 404);
        }

        return ctx.json(
            result
        , 200)
    })
}