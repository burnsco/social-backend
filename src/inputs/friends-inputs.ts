import { Field, InputType } from 'type-graphql';

@InputType()
export default class FriendsInput {
  @Field(() => String, { nullable: true })
  username?: string;
}
