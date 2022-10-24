import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'
import { v4 } from 'uuid'
import { Category, PrivateMessage } from '.'

@Entity()
@ObjectType()
export default class User {
  @Field(() => String)
  @PrimaryKey()
  id: string = v4()

  @Field(() => String)
  @Property()
  createdAt: Date = new Date()

  @Field(() => String)
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  @Field(() => Boolean, { defaultValue: false })
  @Property()
  online?: boolean

  @Field(() => String)
  @Property()
  email!: string

  @Field(() => String)
  @Property({ unique: true })
  username!: string

  @Property()
  password!: string

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  avatar?: string

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  about?: string

  @Field(() => [User])
  @ManyToMany(() => User)
  friends = new Collection<User>(this)

  @Field(() => [PrivateMessage])
  @ManyToMany(() => PrivateMessage)
  privateMessages = new Collection<PrivateMessage>(this)

  @Field(() => [Category])
  @ManyToMany(() => Category)
  chatRooms = new Collection<Category>(this)
}
