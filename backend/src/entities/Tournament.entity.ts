import { Collection, EntitySchema } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { AgeGroup } from './age-group.entity.ts';
import { Competitor } from './Competitor.entity.ts';
import { Category } from './Category.entity.ts';

export enum EnumRank {
  WHITE = 'Ceinture Blanche',
  WHITE_YELLOW = 'Ceinture Blanche-Jaune',
  YELLOW = 'Ceinture Jaune',
  YELLOW_ORANGE = 'Ceinture Jaune-Orange',
  ORANGE = 'Ceinture Orange',
  ORANGE_GREEN = 'Ceinture Orange-Verte',
  GREEN = 'Ceinture Verte',
  GREEN_BLUE = 'Ceinture Verte-Bleue',
  BLUE = 'Ceinture Bleue',
  BLUE_BROWN = 'Ceinture Bleue-Marron',
  BROWN = 'Ceinture Marron',
  BLACK_1 = 'Ceinture Noire 1ère dan',
  BLACK_2 = 'Ceinture Noire 2ème dan',
  BLACK_3 = 'Ceinture Noire 3ème dan',
  BLACK_4 = 'Ceinture Noire 4ème dan',
  BLACK_5 = 'Ceinture Noire 5ème dan',
  BLACK_6 = 'Ceinture Noire 6ème dan',
}


export class Tournament {
  id!: string;
  name!: string;
  description?: string;
  city?: string;
  start_date!: Date;
  end_date?: Date;
  competitors = new Collection<Competitor>(this);
}

export const TournamentSchema = new EntitySchema({
  class: Tournament,
  properties: {
    id: { type: 'uuid', onCreate: () => v4(), primary: true },
    name: { type: String },
    description: { type: String },
    city: { type: String },
    start_date: { type: Date },
    end_date: { type: Date },
    competitors: { kind: 'm:n', entity: () => Competitor, pivotTable: 'tournament_competitor_category' },
  },
});


