import { EntitySchema} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { AgeGroup } from './age-group.entity.ts';
import { EnumRank } from './Tournament.entity.ts';
import { EnumGender } from './weight-category.ts';

export enum EnumRole {
    ADMIN = 'admin',
    COMPETITOR = 'comptiteur',
    GESTIONNAIRE = 'gestionnaire',
    VISITOR = 'visiteur'
}
export class Competitor{
    id!: string ;
    firstname!: string;
    lastname!: string;
    email!: string;
    password!: string;
    birthday!: Date;
    club?: string;
    country!: string;
    weight?: number;
    rank!: EnumRank ;
    gender!: EnumGender ;
    role!: EnumRole;
}

export const CompetitorSchema = new EntitySchema({
    class: Competitor,
    properties: {
        id: {type: 'uuid', onCreate: () => v4(), primary: true },
        firstname: {type: String},
        lastname: {type: String},
        email: {type: String, unique: true},
        password: {type: String},
        birthday: {type: Date},
        club: {type: String},
        country: {type: String},
        weight: {type: Number},
        rank: { enum: true, items: () => Object.values(EnumRank) },
        gender: { enum: true, items: () => Object.values(EnumGender)},
        role: { enum: true, items: () => Object.values(EnumRole), default: EnumRole.COMPETITOR },
    }
})