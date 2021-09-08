import { ArgsType, Field, Int } from "type-graphql"

@ArgsType()
export default class ChatRoomArgsForQuery {
  @Field(() => Int)
  categoryId: number
}
