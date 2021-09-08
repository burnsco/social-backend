import { Field, ObjectType } from "type-graphql"

@ObjectType()
export default class SomeoneAddedYou {
  @Field(() => String)
  userWhoAddedYou: string

  @Field(() => String)
  userWhoWasAdded: string
}
