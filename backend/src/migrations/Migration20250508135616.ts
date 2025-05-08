import { Migration } from '@mikro-orm/migrations';

export class Migration20250508135616 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`competitor\` modify \`role\` enum('Admin', 'Competiteur', 'Gestionnaire', 'Visiteur') not null default 'Competiteur';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`competitor\` modify \`role\` enum('admin', 'comptiteur', 'gestionnaire', 'visiteur') not null default 'comptiteur';`);
  }

}
