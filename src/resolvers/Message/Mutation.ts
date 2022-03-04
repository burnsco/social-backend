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
import NewMessageArgs from '../../args/message-args';
import { Topic } from '../../common/topics';
import { Category, Message, User } from '../../entities';
import MessageInput from '../../inputs/message-input';
import { isAuth } from '../../lib/isAuth';
import { ContextType } from '../../types';

@Resolver(() => Message)
export default class MessageMutationResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createMessage(
    @Arg('data') { content, categoryId }: MessageInput,
    @PubSub(Topic.NewMessage)
    notifyAboutNewMessage: Publisher<Message>,
    @Ctx() { em, req }: ContextType,
  ): Promise<boolean> {
    const category = await em.findOne(
      Category,
      { id: categoryId },
      {
        populate: ['messages'],
        strategy: LoadStrategy.JOINED,
      },
    );
    if (!category) {
      return false;
    }
    if (category && req.session.userId) {
      const message = em.create(Message, {
        createdAt: new Date(),
        updatedAt: new Date(),
        category: em.getReference(Category, category.id),
        content,
        sentBy: em.getReference(User, req.session.userId),
      });
      em.persist(category);

      category.messages.add(message);

      await em.flush();
      await notifyAboutNewMessage(message);

      return true;
    }
    return false;
  }

  // *** SUBSCRIPTION *** \\

  @Subscription(() => Message, {
    topics: Topic.NewMessage,
    filter: ({ payload, args }) => {
      return payload.category === args.categoryId;
    },
  })
  async newMessage(
    @Root() newMessage: Message,
    @Args() { categoryId }: NewMessageArgs,
  ): Promise<Message> {
    return newMessage;
  }
}
