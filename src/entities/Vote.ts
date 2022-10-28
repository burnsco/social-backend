import {
  Cascade,
  Entity,
  LoadStrategy,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core'
import { Field, Int, ObjectType } from 'type-graphql'
import { v4 } from 'uuid'
import { Post, User } from '.'

@Entity()
@ObjectType()
export default class Vote {
  @Field(() => String)
  @PrimaryKey()
  id: string = v4()

  @Field(() => String)
  @Property()
  createdAt: Date = new Date()

  @Field(() => String)
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  @Field(() => Int)
  @Property()
  value!: number

  @Field(() => User)
  @ManyToOne(() => User)
  castBy!: User

  @ManyToOne(() => Post, {
    cascade: [Cascade.ALL],
    strategy: LoadStrategy.JOINED,
  })
  post!: Post
}
