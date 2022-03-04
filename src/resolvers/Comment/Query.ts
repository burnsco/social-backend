import { QueryOrder } from '@mikro-orm/core';
import { Args, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { PostArgs } from '../../args';
import { Comment, Post, User } from '../../entities';
import { ContextType } from '../../types';

@Resolver(() => Comment)
export default class CommentQueryResolver {
  @Query(() => Comment)
  async comment(
    @Args() { postId }: PostArgs,
    @Ctx() { em }: ContextType,
  ): Promise<Comment | null> {
    return await em.findOne(Comment, { post: { id: postId } });
  }

  @Query(() => [Comment], { nullable: true })
  async comments(
    @Args() { first, skip, postId }: PostArgs,
    @Ctx() { em }: ContextType,
  ): Promise<Comment[] | null> {
    const [comments] = await em.findAndCount(
      Comment,
      { post: { id: postId } },
      {
        limit: first,
        offset: skip,
        orderBy: {
          createdAt: QueryOrder.DESC,
        },
      },
    );
    return comments;
  }

  @FieldResolver()
  async createdBy(
    @Root() comment: Comment,
    @Ctx() { em }: ContextType,
  ): Promise<User | null> {
    return await em.findOne(User, comment.createdBy.id);
  }

  @FieldResolver()
  async post(
    @Root() comment: Comment,
    @Ctx() { em }: ContextType,
  ): Promise<Post | null> {
    return await em.findOne(Post, comment.post.id);
  }
}
