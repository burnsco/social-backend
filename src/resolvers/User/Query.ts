import type { Collection, LoadedCollection } from '@mikro-orm/core';
import { LoadStrategy } from '@mikro-orm/core';
import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { Category, User } from '../../entities';
import PrivateMessage from '../../entities/PrivateMessage';
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

  @Query(() => [Category], { nullable: true })
  async myChatRooms(
    @Ctx() { req, em }: ContextType,
  ): Promise<
    (Collection<Category, unknown> & LoadedCollection<Category>) | null
  > {
    if (req?.session?.userId) {
      const user = await em.findOne(
        User,
        { id: req.session.userId },
        {
          populate: ['chatRooms'],
          strategy: LoadStrategy.JOINED,
        },
      );
      if (user?.chatRooms) {
        const chatRooms = user.chatRooms;
        return chatRooms;
      }
    }
    return null;
  }

  @Query(() => [PrivateMessage], { nullable: true })
  async myPrivateMessages(
    @Ctx() { req, em }: ContextType,
  ): Promise<
    | (Collection<PrivateMessage, unknown> & LoadedCollection<PrivateMessage>)
    | null
  > {
    if (req?.session?.userId) {
      const user = await em.findOne(
        User,
        { id: req.session.userId },
        {
          populate: ['privateMessages'],
          strategy: LoadStrategy.JOINED,
        },
      );
      if (user?.privateMessages) {
        return user.privateMessages;
      }
    }
    return null;
  }

  @Query(() => [User], { nullable: true })
  async myFriends(
    @Ctx() { req, em }: ContextType,
  ): Promise<(Collection<User, unknown> & LoadedCollection<User>) | null> {
    if (req?.session?.userId) {
      const user = await em.findOne(
        User,
        { id: req.session.userId },
        {
          populate: ['friends'],
          strategy: LoadStrategy.JOINED,
        },
      );
      if (user?.friends) {
        const friends = user.friends;
        return friends;
      }
    }
    return null;
  }

  @FieldResolver({ nullable: true })
  async privateMessages(@Root() user: User) {
    return user.privateMessages;
  }
}
