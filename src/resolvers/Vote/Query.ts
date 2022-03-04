import { Ctx, FieldResolver, Resolver, Root } from 'type-graphql';
import { User, Vote } from '../../entities';
import { ContextType } from '../../types';

@Resolver(() => Vote)
export default class VoteQueryResolver {
  @FieldResolver(() => User)
  async castBy(@Root() vote: Vote, @Ctx() { em }: ContextType): Promise<User> {
    return await em.findOneOrFail(User, vote.castBy.id);
  }
}
