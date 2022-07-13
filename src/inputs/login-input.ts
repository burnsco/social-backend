import { Field, InputType } from 'type-graphql';
import type { User } from '../entities';

@InputType()
export default class LoginInput implements Partial<User> {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}
