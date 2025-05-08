import { z } from "@hono/zod-openapi";
import { EnumRank } from "../../entities/Tournament.entity.ts";
import { AgeGroup } from "../../entities/age-group.entity.ts";
import { EnumGender } from "../../entities/weight-category.ts";
import { EnumEliminationType } from "../../entities/Category.entity.ts";


export const TournamentSchema = z.object({
    id: z.optional(z.string().uuid()),
    name: z.optional(z.string()) ,
    city: z.optional(z.string()),
    start_date: z.optional(z.coerce.date()),
    end_date: z.optional(z.coerce.date()),
    description : z.optional(z.string())
})

export type Tournament = z.infer<typeof TournamentSchema>

export const CategorySchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    rank: z.array(z.nativeEnum(EnumRank)),
    gender: z.optional(z.nativeEnum(EnumGender)),
    weight_category: z.optional(z.number()),
    elimination_type: z.nativeEnum(EnumEliminationType),
    age_group: z.optional(z.number())
})


export const CategorySchemaCreate = CategorySchema.omit({id : true})

export const CategorySchemaUpdate = CategorySchema.omit({id : true}).partial()

export type Category = z.infer<typeof CategorySchema>
    

