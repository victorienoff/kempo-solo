import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { AgeGroup } from '../entities/age-group.entity.ts';
import { Right } from '../entities/right.entity.ts';
import { use } from 'hono/jsx';
import { EnumRole } from '../entities/Competitor.entity.ts';

export class DatabaseSeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {
    
    const mini_poussin = em.create(AgeGroup, {
      name: "Mini-Poussin",
      age_min: 0,
      age_max: 5
  });

  const poussin = em.create(AgeGroup, {
      name: "Poussin",
      age_min: 6,
      age_max: 7
  });

  const pupille = em.create(AgeGroup, {
      name: "Pupille",
      age_min: 8,
      age_max: 9
  });

  const benjamin = em.create(AgeGroup, {
      name: "Benjamin",
      age_min: 10,
      age_max: 11
  });

  const minime = em.create(AgeGroup, {
      name: "Minime",
      age_min: 12,
      age_max: 13
  });

  const cadet = em.create(AgeGroup, {
      name: "Cadet",
      age_min: 14,
      age_max: 15
  });

  const junior = em.create(AgeGroup, {
      name: "Junior",
      age_min: 16,
      age_max: 17
  });

  const senior = em.create(AgeGroup, {
      name: "Senior",
      age_min: 18,
      age_max: 40
  });

  const veteran = em.create(AgeGroup, {
      name: "Vétéran",
      age_min: 41,
      age_max: 100
  });
  

  const userGestion = em.create(Right,{
    id: "userGestion",
    name: "Gestion du compte utilisateur",
    role: [EnumRole.COMPETITOR, EnumRole.GESTIONNAIRE, EnumRole.ADMIN]
  });
  const userCreate = em.create(Right,{
    id: "userCreate",
    name: "Création d'un compte utilisateur",
    role: [ EnumRole.ADMIN]
  });
  const userDelete = em.create(Right,{
    id: "userDelete",
    name: "Suppression d'un compte utilisateur",
    role: [ EnumRole.ADMIN]
  });
  const userPasswordReset = em.create(Right,{
    id: "userPasswordReset",
    name: "Réinitialisation du mot de passe",
    role: [ EnumRole.COMPETITOR, EnumRole.GESTIONNAIRE, EnumRole.ADMIN]
  });
  const tournamentView = em.create(Right,{
    id: "tournamentView",
    name: "Visualisation des tournois",
    role: [ EnumRole.VISITOR,EnumRole.COMPETITOR, EnumRole.GESTIONNAIRE, EnumRole.ADMIN]
  });
  const tournamentCreate = em.create(Right,{
    id: "tournamentCreate",
    name: "Création d'un tournoi et de catégories",
    role: [ EnumRole.GESTIONNAIRE, EnumRole.ADMIN]
  });
  const tournamentUpdate = em.create(Right,{
    id: "tournamentUpdate",
    name: "Modification d'un tournoi",
    role: [ EnumRole.GESTIONNAIRE, EnumRole.ADMIN]
  });
  const tournamentSignUp = em.create(Right,{
    id: "tournamentSignUp",
    name: "Inscription à un tournoi",
    role: [ EnumRole.COMPETITOR, EnumRole.GESTIONNAIRE, EnumRole.ADMIN]
  });
  }
}
