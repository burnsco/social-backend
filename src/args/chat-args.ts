import { ArgsType, Field } from 'type-graphql'

@ArgsType()
export default class ChatRoomArgsForQuery {
  @Field(() => String)
  categoryName: string
}
