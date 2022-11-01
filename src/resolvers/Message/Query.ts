import { QueryOrder } from '@mikro-orm/core'
import { Args, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql'
import ChatRoomArgsForQuery from '../../args/chat-args'
import { Category, Message, User } from '../../entities'
import { ContextType } from '../../types'

@Resolver(() => Message)
export default class MessageQueryResolver {
  @Query(() => [Message], { nullable: true })
  async messages(
    @Args() { categoryId }: ChatRoomArgsForQuery,
    @Ctx() { em }: ContextType,
  ): Promise<Message[] | null> {
    try {
      const messages = await em.find(
        Message,
        { category: categoryId },
        {
          orderBy: {
            createdAt: QueryOrder.ASC,
          },
        },
      )
      console.log('messages')
      console.log(messages)
      return messages
    } catch (error) {
      console.log('error finding messages')
      console.log(error)
      return null
    }
  }

  @FieldResolver(() => Category)
  async category(
    @Root() message: Message,
    @Ctx() { em }: ContextType,
  ): Promise<Category> {
    return await em.findOneOrFail(Category, message.category)
  }

  @FieldResolver()
  async sentBy(
    @Root() message: Message,
    @Ctx() { em }: ContextType,
  ): Promise<User> {
    return await em.findOneOrFail(User, message.sentBy)
  }
}
