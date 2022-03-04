import { ArgsType, Field, ID } from 'type-graphql';

@ArgsType()
export default class ChatRoomArgsForQuery {
  @Field(() => ID)
  categoryId: string;
}
