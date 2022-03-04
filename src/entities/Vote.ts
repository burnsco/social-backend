import {
  Cascade,
  Entity,
  LoadStrategy,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ID, Int, ObjectType } from 'type-graphql';
import { Post, User } from '.';

@Entity()
@ObjectType()
export default class Vote {
  @Field(() => ID)
  @PrimaryKey()
  readonly id: number;

  @Field(() => String)
  @Property()
  createdAt: string = new Date().toISOString();

  @Field(() => String)
  @Property({ onUpdate: () => new Date().toISOString() })
  updatedAt: string = new Date().toISOString();

  @Field(() => Int)
  @Property()
  value!: number;

  @Field(() => User)
  @ManyToOne(() => User)
  castBy!: User;

  @ManyToOne(() => Post, {
    cascade: [Cascade.ALL],
    strategy: LoadStrategy.JOINED,
  })
  post!: Post;
}
