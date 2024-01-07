import { Migration } from '@mikro-orm/migrations';

export class Migration20240107181852 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("auth_id" uuid not null, "email" text not null, "password" text not null, "role" text check ("role" in (\'user\', \'admin\')) not null default \'user\', "created_at" timestamptz(0) not null, constraint "user_pkey" primary key ("auth_id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user" cascade;');
  }

}
