import { LoadStrategy } from '@mikro-orm/core';
import {
  Arg,
  Args,
  Ctx,
  Mutation,
  Publisher,
  PubSub,
  Resolver,
  Root,
  Subscription,
  UseMiddleware,
} from 'type-graphql';
import PrivateMessageArgs from '../../args/private-message-args';
import { Topic } from '../../common/topics';
import { User } from '../../entities';
import PrivateMessage from '../../entities/PrivateMessage';
import PrivateMessageInput from '../../inputs/private-message-input';
import { isAuth } from '../../lib/isAuth';
import { ContextType } from '../../types';

@Resolver(() => PrivateMessage)
export default class PrivateMessageMutationResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async sendPrivateMessage(
    @Arg('data') { body, userId }: PrivateMessageInput,
    @PubSub(Topic.NewPrivateMessage)
    notifyAboutNewPrivateMessage: Publisher<PrivateMessage>,
    @Ctx()
    { em, req }: ContextType,
  ): Promise<boolean> {
    const user = await em.findOne(
      User,
      { id: req.session.userId },
      {
        populate: ['privateMessages'],
        strategy: LoadStrategy.JOINED,
      },
    );
    const receipent = await em.findOne(
      User,
      { id: userId },
      {
        populate: ['privateMessages'],
        strategy: LoadStrategy.JOINED,
      },
    );

    if (user && receipent && req.session.userId) {
      const newmessage = em.create(PrivateMessage, {
        body,
        sentBy: em.getReference(User, user.id),
        sentTo: em.getReference(User, receipent.id),
      });

      em.persist(user);
      em.persist(receipent);
      em.persist(newmessage);

      user.privateMessages.add(newmessage);
      receipent.privateMessages.add(newmessage);

      await em.flush();
      await notifyAboutNewPrivateMessage(newmessage);

      return true;
    }
    return false;
  }

  // *** SUBSCRIPTION *** \\

  @Subscription(() => PrivateMessage, {
    topics: Topic.NewPrivateMessage,
    filter: ({ payload, args }) => {
      return payload.sentTo === args.userId;
    },
  })
  newPrivateMessage(
    @Root() newPrivateMessage: PrivateMessage,
    @Args() { userId }: PrivateMessageArgs,
  ): PrivateMessage {
    return newPrivateMessage;
  }
}
