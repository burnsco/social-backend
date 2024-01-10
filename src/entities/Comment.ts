import {
  Cascade,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'
import { v4 } from 'uuid'
import { Post, User } from '.'

@Entity()
@ObjectType()
export default class Comment {
  @Field(() => String)
  @PrimaryKey()
  id: string = v4()

  @Field(() => String)
  @Property()
  createdAt: Date = new Date()

  @Field(() => String)
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  @Field(() => String)
  @Property()
  body!: string

  @Field(() => User)
  @ManyToOne(() => User)
  createdBy!: User

  @Field(() => Post)
  @ManyToOne(() => Post, {
    cascade: [Cascade.ALL],
  })
  post!: Post
}
