import { Field, ID, InputType } from 'type-graphql';

@InputType()
export default class CommentInput {
  @Field(() => String)
  body: string;

  @Field(() => ID)
  postId: string;
}
