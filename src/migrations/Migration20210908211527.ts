import { Migration } from '@mikro-orm/migrations';

export class Migration20210908211527 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "created_at" varchar(255) not null, "updated_at" varchar(255) not null, "online" bool not null, "email" varchar(255) not null, "username" varchar(255) not null, "password" varchar(255) not null, "avatar" varchar(255) null, "about" varchar(255) null);');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');

    this.addSql('create table "user_friends" ("user_1_id" int4 not null, "user_2_id" int4 not null);');
    this.addSql('alter table "user_friends" add constraint "user_friends_pkey" primary key ("user_1_id", "user_2_id");');

    this.addSql('create table "private_message" ("id" serial primary key, "created_at" varchar(255) not null, "updated_at" varchar(255) not null, "body" varchar(255) not null, "sent_by_id" int4 not null, "sent_to_id" int4 null);');

    this.addSql('create table "user_private_messages" ("user_id" int4 not null, "private_message_id" int4 not null);');
    this.addSql('alter table "user_private_messages" add constraint "user_private_messages_pkey" primary key ("user_id", "private_message_id");');

    this.addSql('create table "category" ("id" serial primary key, "created_at" varchar(255) not null, "name" varchar(255) not null, "avatar" varchar(255) null);');
    this.addSql('alter table "category" add constraint "category_name_unique" unique ("name");');

    this.addSql('create table "message" ("id" serial primary key, "created_at" varchar(255) not null, "content" varchar(255) not null, "sent_by_id" int4 not null, "category_id" int4 null);');

    this.addSql('create table "post" ("id" serial primary key, "created_at" varchar(255) not null, "updated_at" varchar(255) not null, "title" varchar(255) not null, "text" varchar(255) null, "link" varchar(255) null, "image" varchar(255) null, "image_h" int4 null, "image_w" int4 null, "author_id" int4 not null, "category_id" int4 not null);');

    this.addSql('create table "comment" ("id" serial primary key, "created_at" varchar(255) not null, "updated_at" varchar(255) not null, "body" varchar(255) not null, "created_by_id" int4 not null, "post_id" int4 null);');

    this.addSql('create table "vote" ("id" serial primary key, "created_at" varchar(255) not null, "updated_at" varchar(255) not null, "value" int4 not null, "cast_by_id" int4 not null, "post_id" int4 null);');

    this.addSql('create table "user_chat_rooms" ("user_id" int4 not null, "category_id" int4 not null);');
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

}
