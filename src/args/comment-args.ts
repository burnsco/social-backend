import { ArgsType, Field, Int } from 'type-graphql'

@ArgsType()
export default class NewCommentsArgs {
  @Field(() => Int)
  postId: number
}
