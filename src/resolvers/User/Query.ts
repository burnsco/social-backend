import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { User } from '../../entities';
import { EditUserInput } from '../../inputs';
import { ContextType } from '../../types';

@Resolver(() => User)
export default class UserQueryResolver {
  @Query(() => User, { nullable: true })
  async user(
    @Arg('data') data: EditUserInput,
    @Ctx() { em }: ContextType,
  ): Promise<User | null> {
    return em.findOne(User, { username: data.username });
  }

  @Query(() => [User], { nullable: true })
  async users(@Ctx() { em }: ContextType): Promise<User[] | null> {
    return em.find(User, {});
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: ContextType): Promise<User | null> {
    if (req?.session?.userId) {
      return em.findOne(User, { id: req.session.userId });
    }
    return null;
  }

  @FieldResolver({ nullable: true })
  async privateMessages(@Root() user: User) {
    return user.privateMessages;
  }
}
