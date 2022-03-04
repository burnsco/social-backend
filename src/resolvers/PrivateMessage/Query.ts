import { Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { PrivateMessage, User } from '../../entities';
import { ContextType } from '../../types';

@Resolver(() => PrivateMessage)
export default class PrivateMessageQueryResolver {
  @Query(() => PrivateMessage, { nullable: true })
  async privateMessage(
    @Ctx() { em, req }: ContextType,
  ): Promise<PrivateMessage> {
    return await em.findOneOrFail(PrivateMessage, {
      sentTo: { id: req.session.userId },
    });
  }

  @FieldResolver(() => PrivateMessage)
  async sentBy(
    @Root() privateMessage: PrivateMessage,
    @Ctx() { em }: ContextType,
  ): Promise<User> {
    return await em.findOneOrFail(User, privateMessage.sentBy);
  }

  @FieldResolver(() => User)
  async sentTo(
    @Root() privateMessage: PrivateMessage,
    @Ctx() { em }: ContextType,
  ): Promise<User> {
    return await em.findOneOrFail(User, privateMessage.sentTo);
  }
}
