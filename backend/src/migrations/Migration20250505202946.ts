import { Migration } from '@mikro-orm/migrations';

export class Migration20250505202946 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`competitor\` add \`email\` varchar(255) not null, add \`password\` varchar(255) not null;`);
    this.addSql(`alter table \`competitor\` add unique \`competitor_email_unique\`(\`email\`);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`competitor\` drop index \`competitor_email_unique\`;`);
    this.addSql(`alter table \`competitor\` drop column \`email\`, drop column \`password\`;`);
  }

}
