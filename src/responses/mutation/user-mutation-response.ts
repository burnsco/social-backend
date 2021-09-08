import { Field, ObjectType } from "type-graphql"
import MutationResponse from "../../common/mutation-response"
import { Message, User } from "../../entities"

@ObjectType()
export default class UserMutationResponse extends MutationResponse {
  @Field(() => User, { nullable: true })
  user?: User

  @Field(() => Message, { nullable: true })
  message?: Message
}
