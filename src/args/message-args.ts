import { ArgsType, Field } from 'type-graphql'

@ArgsType()
export default class NewMessageArgs {
  @Field(() => String, { nullable: true })
  categoryName: string
}
