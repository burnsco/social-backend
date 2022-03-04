import { MaxLength, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export default class CategoryInput {
  @Field(() => String)
  @MinLength(3)
  @MaxLength(15)
  name: string;
}
