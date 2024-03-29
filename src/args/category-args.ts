import { Max, Min } from 'class-validator'
import { ArgsType, Field, Int } from 'type-graphql'

@ArgsType()
export default class CategoryArgs {
  @Field(() => Int, { nullable: true })
  first?: number

  @Field(() => Int, { nullable: true })
  @Min(1)
  @Max(500)
  skip?: number

  @Field(() => String, { nullable: true })
  orderBy?: string

  @Field(() => String, { nullable: true })
  categoryId?: string

  @Field(() => String, { nullable: true })
  name?: string
}
