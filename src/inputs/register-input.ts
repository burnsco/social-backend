import { Field, InputType } from 'type-graphql';
import type { User } from '../entities';

@InputType()
export default class RegisterInput implements Partial<User> {
  @Field(() => String)
  email: string;

  @Field(() => String)
  username: string;

  @Field()
  password: string;

  @Field(() => String, { nullable: true })
  avatar?: string;

  @Field(() => String, { nullable: true })
  about?: string;
}
