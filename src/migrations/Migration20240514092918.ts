import { Migration } from '@mikro-orm/migrations';

export class Migration20240514092918 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "answer" drop constraint "fkl5d1p4xac12uhcyqb2rve6o9y";',
    );

    this.addSql(
      'create table "creator" ("id" uuid not null, "fullname" text not null, "phone" text not null, "institution" text not null, constraint "creator_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "user" ("auth_id" uuid not null, "email" text not null, "password" text not null, "role" text check ("role" in (\'user\', \'admin\')) not null default \'user\', "created_at" date not null, constraint "user_pkey" primary key ("auth_id"));',
    );

    this.addSql('drop table if exists "answer" cascade;');

    this.addSql('drop table if exists "question" cascade;');
  }

  async down(): Promise<void> {
    this.addSql(
      'create table "answer" ("aid" bytea not null, "content" varchar(255) null, "is_correct" bool null, "qid" bytea null, constraint "answer_pkey" primary key ("aid"));',
    );

    this.addSql(
      'create table "question" ("qid" bytea not null, "category" varchar(255) null, "statement" varchar(255) null, constraint "question_pkey" primary key ("qid"));',
    );

    this.addSql(
      'alter table "answer" add constraint "fkl5d1p4xac12uhcyqb2rve6o9y" foreign key ("qid") references "question" ("qid") on update no action on delete no action;',
    );

    this.addSql('drop table if exists "creator" cascade;');

    this.addSql('drop table if exists "user" cascade;');
  }
}
