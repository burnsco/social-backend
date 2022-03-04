import { Field, ObjectType } from 'type-graphql';
import MutationResponse from '../../common/mutation-response';
import { Post, Vote } from '../../entities';

@ObjectType()
export default class VoteMutationResponse extends MutationResponse {
  @Field(() => Vote, { nullable: true })
  vote?: Vote;

  @Field(() => Post, { nullable: true })
  post?: Post;
}
