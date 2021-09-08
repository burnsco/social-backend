import { Field, InputType, Int } from "type-graphql"
import PrivateMessage from "../entities/PrivateMessage"

@InputType()
export default class PrivateMessageInput implements Partial<PrivateMessage> {
  @Field()
  body: string

  @Field(() => Int)
  userId: number
}
