import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'
import { v4 } from 'uuid'
import { Category, User } from '.'

@Entity()
@ObjectType()
export default class Message {
  @Field(() => String)
  @PrimaryKey()
  id: string = v4()

  @Field(() => String)
  @Property()
  createdAt: Date = new Date()

  @Field(() => String)
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  @Field()
  @Property()
  content!: string

  @Field(() => User)
  @ManyToOne(() => User)
  sentBy!: User

  @Field(() => Category)
  @ManyToOne(() => Category)
  category!: Category
}
