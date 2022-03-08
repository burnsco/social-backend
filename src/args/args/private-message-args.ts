import { ArgsType, Field, ID } from 'type-graphql';

@ArgsType()
export default class PrivateMessageArgs {
  @Field(() => ID)
  userId: string;
}
