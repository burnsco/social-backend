import { Field, InputType } from 'type-graphql'

@InputType()
export default class RequestToAddFriendInput {
  @Field(() => String)
  username: string
}
