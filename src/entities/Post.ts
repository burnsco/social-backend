import {
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property
} from "@mikro-orm/core"
import { ID, Int, ObjectType } from "type-graphql"
import { Field } from "type-graphql/dist/decorators/Field"
import { Category, Comment, User, Vote } from "."

@Entity()
@ObjectType()
export default class Post {
  @Field(() => ID)
  @PrimaryKey()
  readonly id: number

  @Field(() => String)
  @Property()
  createdAt: string = new Date().toISOString()

  @Field(() => String)
  @Property({ onUpdate: () => new Date().toISOString() })
  updatedAt: string = new Date().toISOString()

  @Field(() => String)
  @Property()
  title!: string

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  text?: string

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  link?: string

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  image?: string

  @Field(() => Int, { nullable: true })
  @Property({ nullable: true })
  imageH?: number

  @Field(() => Int, { nullable: true })
  @Property({ nullable: true })
  imageW?: number

  @Field(() => User)
  @ManyToOne(() => User, { onDelete: "cascade" })
  author!: User

  @Field(() => Category)
  @ManyToOne(() => Category, {
    onDelete: "cascade"
  })
  category!: Category

  @Field(() => [Vote], { nullable: true })
  @OneToMany(() => Vote, vote => vote.post, {
    cascade: [Cascade.PERSIST],
    lazy: true
  })
  votes = new Collection<Vote>(this)

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, comment => comment.post, {
    cascade: [Cascade.PERSIST],
    lazy: true
  })
  comments = new Collection<Comment>(this)
}
