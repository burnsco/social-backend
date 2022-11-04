import { ArgsType, Field } from 'type-graphql'

@ArgsType()
export default class CategoryArgsTest {
  @Field(() => String, { nullable: true })
  categoryId?: string

  @Field(() => String, { nullable: true })
  name?: string
}
