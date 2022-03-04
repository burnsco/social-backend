import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export default class UserJoinedChatResponse {
  @Field(() => String)
  userName: string;

  @Field(() => ID)
  category: number;
}
