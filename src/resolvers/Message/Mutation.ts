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
    @Arg('data') { content, categoryName }: MessageInput,
    @PubSub(Topic.NewMessage)
    notifyAboutNewMessage: Publisher<Message>,
    @Ctx() { em, req }: ContextType,
  ): Promise<boolean> {
    const category = await em.findOne(Category, { name: categoryName });
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
      em.persist(message);
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
      console.log('subscription');
      console.log('payload');
      console.log(payload);
      console.log('args');
      console.log(args);
      const isMatch = payload.category.id === args.categoryId;
      console.log('ismatching');
      console.log(isMatch);
      return isMatch;
    },
  })
  newMessage(
    @Root() newMessage: Message,
    @Args() { categoryId }: NewMessageArgs,
  ): Message {
    console.log('new message');
    console.log(newMessage);
    return newMessage;
  }
}
