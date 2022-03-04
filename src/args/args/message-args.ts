import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export default class NewMessageArgs {
  @Field(() => Int)
  categoryId: number;
}
