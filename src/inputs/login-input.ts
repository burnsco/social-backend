import { GraphQLEmail } from 'graphql-custom-types';
import { Field, InputType } from 'type-graphql';
import type { User } from '../entities';

@InputType()
export default class LoginInput implements Partial<User> {
  @Field(() => GraphQLEmail)
  email: string;

  @Field(() => String)
  password: string;
}
