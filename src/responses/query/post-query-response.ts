import { Field, ObjectType } from "type-graphql"
import { Post } from "../../entities"

@ObjectType()
export default class PostQueryResponse {
  @Field(() => Post, { nullable: true })
  post: Post
}
