import { Migration } from '@mikro-orm/migrations';

export class Migration20220713204653 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "online" boolean not null, "email" varchar(255) not null, "username" varchar(255) not null, "password" varchar(255) not null, "avatar" varchar(255) null, "about" varchar(255) null);');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
    this.addSql('alter table "user" add constraint "user_pkey" primary key ("id");');

    this.addSql('create table "user_friends" ("user_1_id" varchar(255) not null, "user_2_id" varchar(255) not null);');
    this.addSql('alter table "user_friends" add constraint "user_friends_pkey" primary key ("user_1_id", "user_2_id");');

    this.addSql('create table "private_message" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "body" varchar(255) not null, "sent_by_id" varchar(255) not null, "sent_to_id" varchar(255) null);');
    this.addSql('alter table "private_message" add constraint "private_message_pkey" primary key ("id");');

    this.addSql('create table "user_private_messages" ("user_id" varchar(255) not null, "private_message_id" varchar(255) not null);');
    this.addSql('alter table "user_private_messages" add constraint "user_private_messages_pkey" primary key ("user_id", "private_message_id");');

    this.addSql('create table "category" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "avatar" varchar(255) null);');
    this.addSql('alter table "category" add constraint "category_name_unique" unique ("name");');
    this.addSql('alter table "category" add constraint "category_pkey" primary key ("id");');

    this.addSql('create table "message" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "content" varchar(255) not null, "sent_by_id" varchar(255) not null, "category_id" varchar(255) not null);');
    this.addSql('alter table "message" add constraint "message_pkey" primary key ("id");');

    this.addSql('create table "post" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" varchar(255) not null, "text" varchar(255) null, "link" varchar(255) null, "image" varchar(255) null, "image_h" int null, "image_w" int null, "author_id" varchar(255) not null, "category_id" varchar(255) not null);');
    this.addSql('alter table "post" add constraint "post_pkey" primary key ("id");');

    this.addSql('create table "comment" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "body" varchar(255) not null, "created_by_id" varchar(255) not null, "post_id" varchar(255) null);');
    this.addSql('alter table "comment" add constraint "comment_pkey" primary key ("id");');

    this.addSql('create table "vote" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "value" int not null, "cast_by_id" varchar(255) not null, "post_id" varchar(255) null);');
    this.addSql('alter table "vote" add constraint "vote_pkey" primary key ("id");');

    this.addSql('create table "user_chat_rooms" ("user_id" varchar(255) not null, "category_id" varchar(255) not null);');
    this.addSql('alter table "user_chat_rooms" add constraint "user_chat_rooms_pkey" primary key ("user_id", "category_id");');

    this.addSql('alter table "user_friends" add constraint "user_friends_user_1_id_foreign" foreign key ("user_1_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_friends" add constraint "user_friends_user_2_id_foreign" foreign key ("user_2_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "private_message" add constraint "private_message_sent_by_id_foreign" foreign key ("sent_by_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "private_message" add constraint "private_message_sent_to_id_foreign" foreign key ("sent_to_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "user_private_messages" add constraint "user_private_messages_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_private_messages" add constraint "user_private_messages_private_message_id_foreign" foreign key ("private_message_id") references "private_message" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "message" add constraint "message_sent_by_id_foreign" foreign key ("sent_by_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "message" add constraint "message_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "post" add constraint "post_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "post" add constraint "post_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "comment" add constraint "comment_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "comment" add constraint "comment_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "vote" add constraint "vote_cast_by_id_foreign" foreign key ("cast_by_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "vote" add constraint "vote_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "user_chat_rooms" add constraint "user_chat_rooms_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_chat_rooms" add constraint "user_chat_rooms_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user_friends" drop constraint "user_friends_user_1_id_foreign";');

    this.addSql('alter table "user_friends" drop constraint "user_friends_user_2_id_foreign";');

    this.addSql('alter table "private_message" drop constraint "private_message_sent_by_id_foreign";');

    this.addSql('alter table "private_message" drop constraint "private_message_sent_to_id_foreign";');

    this.addSql('alter table "user_private_messages" drop constraint "user_private_messages_user_id_foreign";');

    this.addSql('alter table "message" drop constraint "message_sent_by_id_foreign";');

    this.addSql('alter table "post" drop constraint "post_author_id_foreign";');

    this.addSql('alter table "comment" drop constraint "comment_created_by_id_foreign";');

    this.addSql('alter table "vote" drop constraint "vote_cast_by_id_foreign";');

    this.addSql('alter table "user_chat_rooms" drop constraint "user_chat_rooms_user_id_foreign";');

    this.addSql('alter table "user_private_messages" drop constraint "user_private_messages_private_message_id_foreign";');

    this.addSql('alter table "message" drop constraint "message_category_id_foreign";');

    this.addSql('alter table "post" drop constraint "post_category_id_foreign";');

    this.addSql('alter table "user_chat_rooms" drop constraint "user_chat_rooms_category_id_foreign";');

    this.addSql('alter table "comment" drop constraint "comment_post_id_foreign";');

    this.addSql('alter table "vote" drop constraint "vote_post_id_foreign";');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "user_friends" cascade;');

    this.addSql('drop table if exists "private_message" cascade;');

    this.addSql('drop table if exists "user_private_messages" cascade;');

    this.addSql('drop table if exists "category" cascade;');

    this.addSql('drop table if exists "message" cascade;');

    this.addSql('drop table if exists "post" cascade;');

    this.addSql('drop table if exists "comment" cascade;');

    this.addSql('drop table if exists "vote" cascade;');

    this.addSql('drop table if exists "user_chat_rooms" cascade;');
  }

}
