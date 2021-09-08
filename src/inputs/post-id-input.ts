import { Field, InputType, Int } from "type-graphql"

@InputType()
export default class PostIdInput {
  @Field(() => Int)
  postId: number
}
