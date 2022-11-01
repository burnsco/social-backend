import { Field, InputType } from 'type-graphql'

@InputType()
export default class AcceptOrRejectFriendInput {
  @Field(() => String)
  username: string

  @Field(() => Boolean)
  accept: boolean
}
