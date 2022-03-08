import { ArgsType, Field, ID } from 'type-graphql';

@ArgsType()
export default class NewCommentsArgs {
  @Field(() => ID)
  postId: string;
}
