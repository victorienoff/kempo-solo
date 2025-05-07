import { z } from "@hono/zod-openapi";
import { EnumRank } from "../../entities/Tournament.entity.ts";
import { AgeGroup } from "../../entities/age-group.entity.ts";
import { EnumGender } from "../../entities/weight-category.ts";


export const CompetitorSchema = z.object({
    id: z.string().uuid(),
    firstname: z.string() ,
    lastname: z.string() ,
    birthday: z.coerce.date(),
    club: z.string().optional(),
    country: z.string(),
    weight: z.coerce.number().optional(),
    rank: z.nativeEnum(EnumRank),
    gender: z.nativeEnum(EnumGender),
})

export const CompetitorSchemaCreate = CompetitorSchema.omit({id : true})

export const CompetitorSchemaUpdate = CompetitorSchema.omit({id : true}).partial()

export const UserSchemaCreate = CompetitorSchemaCreate.merge(z.object({
        email : z.string().email(),
        password : z.string().min(8).max(20)}))
    
export const UserWithoutPassword = CompetitorSchemaCreate.merge(z.object({
        email : z.string().email()}))


export type Competitor = z.infer<typeof CompetitorSchema>
export type CompetitorCreate = z.infer<typeof CompetitorSchemaCreate>
export type CompetitorUpdate = z.infer<typeof CompetitorSchemaUpdate>
export type UserCreate = z.infer<typeof UserSchemaCreate>