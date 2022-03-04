import { Enum } from '@mikro-orm/core';
import { Field, InputType } from 'type-graphql';
import { OrderBy } from '../common/pagination';

@InputType()
export default class PostOrderBy {
  @Enum(() => OrderBy)
  @Field(() => OrderBy, { nullable: true })
  createdAt?: OrderBy;

  @Enum(() => OrderBy)
  @Field(() => OrderBy, { nullable: true })
  title?: OrderBy;

  @Enum(() => OrderBy)
  @Field(() => OrderBy, { nullable: true })
  updatedAt?: OrderBy;

  @Enum(() => OrderBy)
  @Field(() => OrderBy, { nullable: true })
  votes?: OrderBy;
}
