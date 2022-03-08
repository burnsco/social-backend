import { Field, ID, InputType } from 'type-graphql';

@InputType()
export default class PostIdInput {
  @Field(() => ID)
  postId: string;
}
