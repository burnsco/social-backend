import { Field, InputType, Int } from "type-graphql"

@InputType()
export default class CommentInput {
  @Field(() => String)
  body: string

  @Field(() => Int)
  postId: number
}
