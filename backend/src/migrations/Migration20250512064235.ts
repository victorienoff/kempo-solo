import { Migration } from '@mikro-orm/migrations';

export class Migration20250512064235 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`age_group\` (\`id\` int unsigned not null auto_increment primary key, \`name\` varchar(255) not null, \`age_min\` int not null, \`age_max\` int not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`competitor\` (\`id\` varchar(36) not null, \`firstname\` varchar(255) not null, \`lastname\` varchar(255) not null, \`email\` varchar(255) not null, \`password\` varchar(255) not null, \`birthday\` datetime not null, \`club\` varchar(255) not null, \`country\` varchar(255) not null, \`weight\` int not null, \`rank\` enum('Ceinture Blanche', 'Ceinture Blanche-Jaune', 'Ceinture Jaune', 'Ceinture Jaune-Orange', 'Ceinture Orange', 'Ceinture Orange-Verte', 'Ceinture Verte', 'Ceinture Verte-Bleue', 'Ceinture Bleue', 'Ceinture Bleue-Marron', 'Ceinture Marron', 'Ceinture Noire 1ère dan', 'Ceinture Noire 2ème dan', 'Ceinture Noire 3ème dan', 'Ceinture Noire 4ème dan', 'Ceinture Noire 5ème dan', 'Ceinture Noire 6ème dan') not null, \`gender\` enum('H', 'F') not null, \`role\` enum('Admin', 'Competiteur', 'Gestionnaire', 'Visiteur') not null default 'Competiteur', primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`competitor\` add unique \`competitor_email_unique\`(\`email\`);`);

    this.addSql(`create table \`right\` (\`id\` varchar(36) not null, \`name\` varchar(255) not null, \`role\` text not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`tournament\` (\`id\` varchar(36) not null, \`name\` varchar(255) not null, \`description\` varchar(255) not null, \`city\` varchar(255) not null, \`start_date\` datetime not null, \`end_date\` datetime not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`weight_category\` (\`id\` int unsigned not null auto_increment primary key, \`name\` varchar(255) not null, \`weight_min\` int not null, \`weight_max\` int not null, \`age_group_id\` int unsigned not null, \`gender\` enum('H', 'F') not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`weight_category\` add index \`weight_category_age_group_id_index\`(\`age_group_id\`);`);

    this.addSql(`create table \`category\` (\`id\` varchar(36) not null, \`name\` varchar(255) null, \`tournament_id\` varchar(36) not null, \`rank\` text not null, \`gender\` enum('H', 'F') null, \`weight_category_id\` int unsigned null, \`age_group_id\` int unsigned null, \`elimination_type\` enum('Directe', 'Poule') not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`category\` add index \`category_tournament_id_index\`(\`tournament_id\`);`);
    this.addSql(`alter table \`category\` add index \`category_weight_category_id_index\`(\`weight_category_id\`);`);
    this.addSql(`alter table \`category\` add index \`category_age_group_id_index\`(\`age_group_id\`);`);

    this.addSql(`create table \`tournament_competitor_category\` (\`tournament_id\` varchar(36) not null, \`competitor_id\` varchar(36) not null, \`category_id\` varchar(36) null, primary key (\`tournament_id\`, \`competitor_id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`tournament_competitor_category\` add index \`tournament_competitor_category_tournament_id_index\`(\`tournament_id\`);`);
    this.addSql(`alter table \`tournament_competitor_category\` add index \`tournament_competitor_category_competitor_id_index\`(\`competitor_id\`);`);
    this.addSql(`alter table \`tournament_competitor_category\` add index \`tournament_competitor_category_category_id_index\`(\`category_id\`);`);

    this.addSql(`create table \`match\` (\`id\` varchar(36) not null, \`competitor1_id\` varchar(36) null, \`competitor2_id\` varchar(36) null, \`score1\` int not null default 0, \`score2\` int not null default 0, \`category_id\` varchar(36) not null, \`keikuka1\` int not null default 0, \`keikuka2\` int not null default 0, \`winner_id\` varchar(36) null default null, \`is_finished\` tinyint(1) not null default false, \`pool_number\` varchar(255) not null default '0', \`next_match_id\` varchar(36) null default null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`match\` add index \`match_competitor1_id_index\`(\`competitor1_id\`);`);
    this.addSql(`alter table \`match\` add index \`match_competitor2_id_index\`(\`competitor2_id\`);`);
    this.addSql(`alter table \`match\` add index \`match_category_id_index\`(\`category_id\`);`);
    this.addSql(`alter table \`match\` add index \`match_winner_id_index\`(\`winner_id\`);`);
    this.addSql(`alter table \`match\` add index \`match_next_match_id_index\`(\`next_match_id\`);`);

    this.addSql(`alter table \`weight_category\` add constraint \`weight_category_age_group_id_foreign\` foreign key (\`age_group_id\`) references \`age_group\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`category\` add constraint \`category_tournament_id_foreign\` foreign key (\`tournament_id\`) references \`tournament\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`category\` add constraint \`category_weight_category_id_foreign\` foreign key (\`weight_category_id\`) references \`weight_category\` (\`id\`) on update cascade on delete set null;`);
    this.addSql(`alter table \`category\` add constraint \`category_age_group_id_foreign\` foreign key (\`age_group_id\`) references \`age_group\` (\`id\`) on update cascade on delete set null;`);

    this.addSql(`alter table \`tournament_competitor_category\` add constraint \`tournament_competitor_category_tournament_id_foreign\` foreign key (\`tournament_id\`) references \`tournament\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`tournament_competitor_category\` add constraint \`tournament_competitor_category_competitor_id_foreign\` foreign key (\`competitor_id\`) references \`competitor\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`tournament_competitor_category\` add constraint \`tournament_competitor_category_category_id_foreign\` foreign key (\`category_id\`) references \`category\` (\`id\`) on update cascade on delete set null;`);

    this.addSql(`alter table \`match\` add constraint \`match_competitor1_id_foreign\` foreign key (\`competitor1_id\`) references \`competitor\` (\`id\`) on update cascade on delete set null;`);
    this.addSql(`alter table \`match\` add constraint \`match_competitor2_id_foreign\` foreign key (\`competitor2_id\`) references \`competitor\` (\`id\`) on update cascade on delete set null;`);
    this.addSql(`alter table \`match\` add constraint \`match_category_id_foreign\` foreign key (\`category_id\`) references \`category\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`match\` add constraint \`match_winner_id_foreign\` foreign key (\`winner_id\`) references \`competitor\` (\`id\`) on update cascade on delete set null;`);
    this.addSql(`alter table \`match\` add constraint \`match_next_match_id_foreign\` foreign key (\`next_match_id\`) references \`match\` (\`id\`) on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`weight_category\` drop foreign key \`weight_category_age_group_id_foreign\`;`);

    this.addSql(`alter table \`category\` drop foreign key \`category_age_group_id_foreign\`;`);

    this.addSql(`alter table \`tournament_competitor_category\` drop foreign key \`tournament_competitor_category_competitor_id_foreign\`;`);

    this.addSql(`alter table \`tournament_competitor_category\` drop foreign key \`tournament_competitor_category_competitor_id_foreign\`;`);

    this.addSql(`alter table \`match\` drop foreign key \`match_competitor1_id_foreign\`;`);

    this.addSql(`alter table \`match\` drop foreign key \`match_competitor2_id_foreign\`;`);

    this.addSql(`alter table \`match\` drop foreign key \`match_winner_id_foreign\`;`);

    this.addSql(`alter table \`category\` drop foreign key \`category_tournament_id_foreign\`;`);

    this.addSql(`alter table \`tournament_competitor_category\` drop foreign key \`tournament_competitor_category_tournament_id_foreign\`;`);

    this.addSql(`alter table \`tournament_competitor_category\` drop foreign key \`tournament_competitor_category_tournament_id_foreign\`;`);

    this.addSql(`alter table \`category\` drop foreign key \`category_weight_category_id_foreign\`;`);

    this.addSql(`alter table \`tournament_competitor_category\` drop foreign key \`tournament_competitor_category_category_id_foreign\`;`);

    this.addSql(`alter table \`tournament_competitor_category\` drop foreign key \`tournament_competitor_category_category_id_foreign\`;`);

    this.addSql(`alter table \`match\` drop foreign key \`match_category_id_foreign\`;`);

    this.addSql(`alter table \`match\` drop foreign key \`match_next_match_id_foreign\`;`);

    this.addSql(`drop table if exists \`age_group\`;`);

    this.addSql(`drop table if exists \`competitor\`;`);

    this.addSql(`drop table if exists \`right\`;`);

    this.addSql(`drop table if exists \`tournament\`;`);

    this.addSql(`drop table if exists \`weight_category\`;`);

    this.addSql(`drop table if exists \`category\`;`);

    this.addSql(`drop table if exists \`tournament_competitor_category\`;`);

    this.addSql(`drop table if exists \`match\`;`);
  }

}
