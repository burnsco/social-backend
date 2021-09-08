import { Field, ObjectType } from "type-graphql"
import MutationResponse from "../../common/mutation-response"
import { Post } from "../../entities"

@ObjectType()
export default class PostMutationResponse extends MutationResponse {
  @Field(() => Post, { nullable: true })
  post?: Post
}
