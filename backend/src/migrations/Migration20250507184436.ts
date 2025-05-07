import { Migration } from '@mikro-orm/migrations';

export class Migration20250507184436 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`right\` (\`id\` varchar(36) not null, \`name\` varchar(255) not null, \`role\` text not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`alter table \`competitor\` add \`role\` enum('admin', 'comptiteur', 'gestionnaire', 'visiteur') not null default 'comptiteur';`);

    this.addSql(`alter table \`tournament\` add \`description\` varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists \`right\`;`);

    this.addSql(`alter table \`competitor\` drop column \`role\`;`);

    this.addSql(`alter table \`tournament\` drop column \`description\`;`);
  }

}
