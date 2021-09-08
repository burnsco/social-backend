import { Field, InputType, Int } from "type-graphql"

@InputType()
export default class ChatRoomInput {
  @Field(() => Int)
  categoryId: number
}
