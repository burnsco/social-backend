import {
  Cascade,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property
} from "@mikro-orm/core"
import { Field, ID, ObjectType } from "type-graphql"
import { Post, User } from "."

@Entity()
@ObjectType()
export default class Comment {
  @Field(() => ID)
  @PrimaryKey()
  readonly id: number

  @Field(() => String)
  @Property()
  createdAt: string = new Date().toISOString()

  @Field(() => String)
  @Property({ onUpdate: () => new Date() })
  updatedAt: string = new Date().toISOString()

  @Field(() => String)
  @Property()
  body!: string

  @Field(() => User)
  @ManyToOne(() => User, { onDelete: "cascade" })
  createdBy!: User

  @Field(() => Post)
  @ManyToOne(() => Post, {
    cascade: [Cascade.ALL]
  })
  post!: Post
}
