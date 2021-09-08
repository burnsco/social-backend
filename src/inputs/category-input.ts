import { MaxLength, MinLength } from "class-validator"
import { Field, InputType } from "type-graphql"
import { Category } from "../entities"

@InputType()
export default class CategoryInput implements Partial<Category> {
  @Field(() => String)
  @MinLength(2)
  @MaxLength(20)
  name: string
}
