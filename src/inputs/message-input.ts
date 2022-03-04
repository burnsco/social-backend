import { Field, InputType, Int } from 'type-graphql';
import type { Message } from '../entities';

@InputType()
export default class MessageInput implements Partial<Message> {
  @Field()
  content: string;

  @Field(() => Int)
  categoryId: number;
}
