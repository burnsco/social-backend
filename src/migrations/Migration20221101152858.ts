import { Migration } from '@mikro-orm/migrations';

export class Migration20221101152858 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user_friend_requests" ("user_1_id" varchar(255) not null, "user_2_id" varchar(255) not null, constraint "user_friend_requests_pkey" primary key ("user_1_id", "user_2_id"));');

    this.addSql('alter table "user_friend_requests" add constraint "user_friend_requests_user_1_id_foreign" foreign key ("user_1_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_friend_requests" add constraint "user_friend_requests_user_2_id_foreign" foreign key ("user_2_id") references "user" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user_friend_requests" cascade;');
  }

}
