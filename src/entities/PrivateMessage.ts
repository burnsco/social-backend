import {
  Cascade,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import { v4 } from 'uuid';
import { User } from '.';

@Entity()
@ObjectType()
export default class PrivateMessage {
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
  @Property()
  body!: string;

  @Field(() => User)
  @ManyToOne(() => User, { onDelete: 'cascade' })
  sentBy!: User;

  @Field(() => User)
  @ManyToOne(() => User, {
    cascade: [Cascade.ALL],
  })
  sentTo!: User;
}
