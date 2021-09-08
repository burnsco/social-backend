import { Field, ObjectType } from "type-graphql"
import MutationResponse from "../../common/mutation-response"
import { Comment, Post } from "../../entities"

@ObjectType()
export default class CommentMutationResponse extends MutationResponse {
  @Field(() => Comment, { nullable: true })
  comment?: Comment

  @Field(() => Post, { nullable: true })
  post?: Post
}
