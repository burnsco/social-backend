import { Field, Int, ObjectType } from 'type-graphql';
import MutationResponse from '../../common/mutation-response';
import Comment from '../../entities/Comment';

@ObjectType()
export default class CommentsQueryResponse extends MutationResponse {
  @Field(() => [Comment], { nullable: true })
  comments?: Comment[];

  @Field(() => Int, { nullable: true })
  count?: number;
}
