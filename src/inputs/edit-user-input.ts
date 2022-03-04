import { GraphQLEmail } from 'graphql-custom-types';
import { Field, InputType } from 'type-graphql';
import type { User } from '../entities';

@InputType()
export default class EditUserInput implements Partial<User> {
  @Field(() => GraphQLEmail, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => String, { nullable: true })
  avatar?: string;

  @Field(() => String, { nullable: true })
  about?: string;
}
