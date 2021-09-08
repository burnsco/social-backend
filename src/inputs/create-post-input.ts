import { Field, InputType, Int } from "type-graphql"

@InputType()
export default class CreatePostInput {
  @Field(() => Int)
  categoryId: number

  @Field(() => String)
  title: string

  @Field(() => String, { nullable: true })
  text?: string

  @Field(() => String, { nullable: true })
  image?: string

  @Field(() => String, { nullable: true })
  link?: string

  @Field(() => Int, { nullable: true })
  imageH?: number

  @Field(() => Int, { nullable: true })
  imageW?: number
}
