import { Field, Int, ObjectType } from 'type-graphql';
import MutationResponse from '../../common/mutation-response';
import { Vote } from '../../entities';

@ObjectType()
export default class VotesQueryResponse extends MutationResponse {
  @Field(() => [Vote], { nullable: true })
  votes?: Vote[];

  @Field(() => Int, { nullable: true })
  count?: number;
}
