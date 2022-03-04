import {
  Cascade,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from 'type-graphql';
import { Category, User } from '.';

@Entity()
@ObjectType()
export default class Message {
  @Field(() => ID)
  @PrimaryKey()
  readonly id: number;

  @Field(() => String)
  @Property()
  createdAt: string = new Date().toISOString();

  @Field()
  @Property()
  content!: string;

  @Field(() => User)
  @ManyToOne(() => User, {
    onDelete: 'cascade',
  })
  sentBy!: User;

  @Field(() => Category)
  @ManyToOne(() => Category, {
    cascade: [Cascade.ALL],
  })
  category!: Category;
}
