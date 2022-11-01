import { Field, ObjectType } from 'type-graphql'
import MutationResponse from '../../common/mutation-response'
import { User } from '../../entities'

@ObjectType()
export default class AddUserMutationResponse extends MutationResponse {
  @Field(() => User, { nullable: true })
  friend?: User

  @Field(() => User, { nullable: true })
  me?: User
}
