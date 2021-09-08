import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryKey,
  Property
} from "@mikro-orm/core"
import { Field, ID, ObjectType } from "type-graphql"
import { Message, User } from "."

@Entity()
@ObjectType()
export default class Category {
  @Field(() => ID)
  @PrimaryKey()
  readonly id: number

  @Field(() => String)
  @Property()
  createdAt: string = new Date().toISOString()

  @Field()
  @Property({ unique: true })
  name!: string

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  avatar?: string

  @Field(() => [Message], { nullable: true })
  @OneToMany(() => Message, message => message.category, {
    cascade: [Cascade.ALL],
    lazy: true
  })
  messages = new Collection<Message>(this)

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, user => user.chatRooms, {
    cascade: [Cascade.ALL],
    lazy: true
  })
  chatUsers = new Collection<User>(this)
}
