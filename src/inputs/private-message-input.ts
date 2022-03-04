import { Field, ID, InputType } from 'type-graphql';
import type PrivateMessage from '../entities/PrivateMessage';

@InputType()
export default class PrivateMessageInput implements Partial<PrivateMessage> {
  @Field()
  body: string;

  @Field(() => ID)
  userId: string;
}
