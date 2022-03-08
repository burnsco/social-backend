import { Migration } from '@mikro-orm/migrations';

export class Migration20220308145008 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user_private_messages" drop constraint "user_private_messages_private_message_id_foreign";');

    this.addSql('drop table if exists "private_message" cascade;');

    this.addSql('drop table if exists "user_private_messages" cascade;');

    this.addSql('alter table "message" drop constraint "message_category_id_foreign";');
    this.addSql('alter table "message" drop constraint "message_sent_by_id_foreign";');

    this.addSql('alter table "message" add column "sent_by" varchar(255) not null;');
    this.addSql('alter table "message" drop column "category_id";');
    this.addSql('alter table "message" drop column "user_name";');
    this.addSql('alter table "message" drop column "sent_by_id";');
  }

  async down(): Promise<void> {
    this.addSql('create table "private_message" ("id" varchar not null default null, "created_at" timestamptz not null default null, "updated_at" timestamptz not null default null, "body" varchar not null default null, "sent_by_id" varchar not null default null, "sent_to_id" varchar null default null);');
    this.addSql('alter table "private_message" add constraint "private_message_pkey" primary key ("id");');

    this.addSql('create table "user_private_messages" ("user_id" varchar not null default null, "private_message_id" varchar not null default null);');
    this.addSql('alter table "user_private_messages" add constraint "user_private_messages_pkey" primary key ("user_id", "private_message_id");');

    this.addSql('alter table "private_message" add constraint "private_message_sent_by_id_foreign" foreign key ("sent_by_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "private_message" add constraint "private_message_sent_to_id_foreign" foreign key ("sent_to_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "user_private_messages" add constraint "user_private_messages_private_message_id_foreign" foreign key ("private_message_id") references "private_message" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_private_messages" add constraint "user_private_messages_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "message" add column "category_id" varchar null default null, add column "sent_by_id" varchar not null default null;');
    this.addSql('alter table "message" add constraint "message_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "message" add constraint "message_sent_by_id_foreign" foreign key ("sent_by_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "message" rename column "sent_by" to "user_name";');
  }

}
