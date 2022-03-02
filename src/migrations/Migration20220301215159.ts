import { Migration } from '@mikro-orm/migrations';

export class Migration20220301215159 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "category" add column "avatar" varchar(255) null;');

    this.addSql('alter table "post" drop constraint if exists "post_image_h_check";');
    this.addSql('alter table "post" alter column "image_h" type int4 using ("image_h"::int4);');
    this.addSql('alter table "post" drop constraint if exists "post_image_w_check";');
    this.addSql('alter table "post" alter column "image_w" type int4 using ("image_w"::int4);');

    this.addSql('create table "user_chat_rooms" ("user_id" int4 not null, "category_id" int4 not null);');
    this.addSql('alter table "user_chat_rooms" add constraint "user_chat_rooms_pkey" primary key ("user_id", "category_id");');

    this.addSql('alter table "user_chat_rooms" add constraint "user_chat_rooms_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_chat_rooms" add constraint "user_chat_rooms_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade on delete cascade;');
  }

}
