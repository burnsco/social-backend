import {
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core'
import { Int, ObjectType } from 'type-graphql'
import { Field } from 'type-graphql/dist/decorators/Field'
import { v4 } from 'uuid'
import { Category, Comment, User, Vote } from '.'

@Entity()
@ObjectType()
export default class Post {
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
  @ManyToOne(() => User)
  author!: User

  @Field(() => Category)
  @ManyToOne(() => Category)
  category!: Category

  @Field(() => [Vote], { nullable: true })
  @OneToMany(() => Vote, vote => vote.post, {
    cascade: [Cascade.PERSIST],
    lazy: true,
  })
  votes = new Collection<Vote>(this)

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, comment => comment.post, {
    cascade: [Cascade.PERSIST],
    lazy: true,
  })
  comments = new Collection<Comment>(this)
}
