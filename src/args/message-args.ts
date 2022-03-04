import { ArgsType, Field, ID } from 'type-graphql';

@ArgsType()
export default class NewMessageArgs {
  @Field(() => ID, { nullable: true })
  categoryId: string;
}
