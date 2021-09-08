import { Field, ObjectType } from "type-graphql"
import { Post } from "../../entities"

@ObjectType()
export default class PostsQueryResponse {
  @Field(() => [Post], { nullable: true })
  posts: Post[]
}
