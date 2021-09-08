import { Field, InputType } from "type-graphql"
import { User } from "../entities"

@InputType()
export default class AddUserInput implements Partial<User> {
  @Field(() => String)
  username: string
}
