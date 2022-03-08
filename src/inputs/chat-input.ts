import { Field, ID, InputType } from 'type-graphql';

@InputType()
export default class ChatRoomInput {
  @Field(() => ID)
  categoryId: string;
}
