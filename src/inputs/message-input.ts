import { Field, InputType } from 'type-graphql'
import type { Message } from '../entities'

@InputType()
export default class MessageInput implements Partial<Message> {
  @Field()
  content: string

  @Field()
  categoryName?: string
}
