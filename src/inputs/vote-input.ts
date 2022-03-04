import { Field, ID, InputType, Int } from 'type-graphql';

@InputType()
export default class VoteInput {
  @Field(() => ID)
  postId: string;

  @Field(() => Int)
  value: number;
}
