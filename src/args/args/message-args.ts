import { ArgsType, Field, ID } from 'type-graphql';

@ArgsType()
export default class NewMessageArgs {
  @Field(() => ID)
  categoryId: string;
}
