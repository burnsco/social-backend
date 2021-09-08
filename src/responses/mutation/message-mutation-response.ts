import { Field, ObjectType } from "type-graphql"
import MutationResponse from "../../common/mutation-response"
import { Category, Message } from "../../entities"

@ObjectType()
export default class MessageMutationResponse extends MutationResponse {
  @Field(() => Message)
  message: Message

  @Field(() => Category)
  category: Category
}
