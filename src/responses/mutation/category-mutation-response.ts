import { Field, ObjectType } from 'type-graphql';
import MutationResponse from '../../common/mutation-response';
import { Category } from '../../entities';

@ObjectType()
export default class CategoryMutationResponse extends MutationResponse {
  @Field(() => Category, { nullable: true })
  category?: Category;
}
