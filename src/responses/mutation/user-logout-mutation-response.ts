import { Field, ObjectType } from "type-graphql"

@ObjectType()
export default class UserLogoutMutationResponse {
  @Field(() => String, { nullable: true })
  message?: string
  @Field(() => String, { nullable: true })
  success?: boolean
}
