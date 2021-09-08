import { Field, ObjectType } from "type-graphql"
import MutationResponse from "../../common/mutation-response"
import { Category, User } from "../../entities"

@ObjectType()
export default class UserLeaveJoinSubResponse extends MutationResponse {
  @Field(() => User, { nullable: true })
  user?: User

  @Field(() => Category, { nullable: true })
  category?: Category
}
