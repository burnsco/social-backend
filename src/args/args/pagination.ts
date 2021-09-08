import { ArgsType, Field, Int } from "type-graphql"

@ArgsType()
export default class PaginationArgs {
  @Field(() => Int, { defaultValue: 0 })
  skip: number

  @Field(() => Int, { defaultValue: 10 })
  take: number

  get startIndex(): number {
    return this.skip
  }
  get endIndex(): number {
    return this.skip + this.take
  }
}
