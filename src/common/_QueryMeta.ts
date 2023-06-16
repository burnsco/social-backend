import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class _QueryMeta {
  @Field(() => Int)
  count: number

  @Field(() => Int, { nullable: true })
  score: number
}
