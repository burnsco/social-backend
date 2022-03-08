import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import { v4 } from 'uuid';
import { User } from '.';

@Entity()
@ObjectType()
export default class Category {
  @Field(() => String)
  @PrimaryKey()
  id: string = v4();

  @Field(() => String)
  @Property()
  createdAt: Date = new Date();

  @Field(() => String)
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Field()
  @Property({ unique: true })
  name!: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  avatar?: string;

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, user => user.chatRooms, {
    cascade: [Cascade.ALL],
    lazy: true,
  })
  chatUsers = new Collection<User>(this);
}
