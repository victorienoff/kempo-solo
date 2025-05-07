import { v4 } from "uuid";
import { EnumRole } from "./Competitor.entity.ts";
import { EntitySchema } from "@mikro-orm/core";

export class Right {
    id!: string;
    name!: string;
    role!: EnumRole[];
}

export const RightSchema = new EntitySchema({
    class: Right,
    properties: {
        id: { type: 'uuid', onCreate: () => v4(), primary: true },
        name: { type: String },
        role: { type:'array' },
    }
});