import { Migration } from '@mikro-orm/migrations';

export class Migration20240106080229_create_database extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "create table `user` (`auth_id` varchar(36) not null, `email` text not null, `password` text not null, `role` enum('user', 'admin') not null default 'user', `created_at` datetime not null, primary key (`auth_id`)) default character set utf8mb4 engine = InnoDB;",
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `user`;');
  }
}
