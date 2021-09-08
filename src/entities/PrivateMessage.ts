import {
  Cascade,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property
} from "@mikro-orm/core"
import { Field, ID, ObjectType } from "type-graphql"
import { User } from "."

@Entity()
@ObjectType()
export default class PrivateMessage {
  @Field(() => ID)
  @PrimaryKey()
  readonly id: number

  @Field(() => String)
  @Property()
  createdAt: string = new Date().toISOString()

  @Field(() => String)
  @Property({ onUpdate: () => new Date().toISOString() })
  updatedAt: string = new Date().toISOString()

  @Field()
  @Property()
  body!: string

  @Field(() => User)
  @ManyToOne(() => User, { onDelete: "cascade" })
  sentBy!: User

  @Field(() => User)
  @ManyToOne(() => User, {
    cascade: [Cascade.ALL]
  })
  sentTo!: User
}
