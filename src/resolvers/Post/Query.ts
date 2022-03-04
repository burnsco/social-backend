import { QueryOrder } from '@mikro-orm/core';
import { Args, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { PostArgs } from '../../args';
import { _QueryMeta } from '../../common/_QueryMeta';
import { Category, Comment, Post, User, Vote } from '../../entities';
import { ContextType } from '../../types';

@Resolver(() => Post)
export default class PostQueryResolver {
  @Query(() => _QueryMeta)
  async _allPostsMeta(@Root() @Ctx() { em }: ContextType) {
    const [, count] = await em.findAndCount(Post, {});
    return { count };
  }

  @Query(() => _QueryMeta)
  async _categoryPostsMeta(
    @Root() posts: Post,
    @Args()
    { name }: PostArgs,
    @Ctx()
    { em }: ContextType,
  ) {
    const [, count] = await em.findAndCount(Post, {
      category: { name },
    });
    return { count };
  }

  @Query(() => Post, { nullable: true })
  async post(@Args() { postId }: PostArgs, @Ctx() { em }: ContextType) {
    return await em.findOne(Post, { id: postId });
  }

  @Query(() => [Post], { nullable: true })
  async posts(
    @Args() { first, skip, category, orderBy }: PostArgs,
    @Ctx() { em }: ContextType,
  ): Promise<Post[]> {
    if (category) {
      const posts = await em.find(
        Post,
        { category: { name: category } },
        {
          limit: first,
          offset: skip,
          orderBy: {
            createdAt: orderBy === 'asc' ? QueryOrder.ASC : QueryOrder.DESC,
          },
        },
      );
      return posts;
    }

    const [posts] = await em.findAndCount(
      Post,
      {},
      {
        limit: first,
        offset: skip,
        orderBy: {
          createdAt: orderBy === 'asc' ? QueryOrder.ASC : QueryOrder.DESC,
        },
      },
    );
    return posts;
  }

  @FieldResolver(() => _QueryMeta, { nullable: true })
  async totalComments(@Root() post: Post, @Ctx() { em }: ContextType) {
    const [, count] = await em.findAndCount(Comment, { post: { id: post.id } });
    return { count };
  }

  @FieldResolver(() => _QueryMeta, { nullable: true })
  async totalVotes(@Root() post: Post, @Ctx() { em }: ContextType) {
    const [votes, count] = await em.findAndCount(Vote, {
      post: { id: post.id },
    });
    if (count > 0) {
      const score = votes.map(item => item.value).reduce((a, b) => a + b);

      return { count, score };
    }
    return { count, score: 0 };
  }

  @FieldResolver({ nullable: true })
  async comments(@Root() post: Post, @Ctx() { em }: ContextType) {
    return await em.find(
      Comment,
      { post: { id: post.id } },
      {
        orderBy: {
          createdAt: QueryOrder.DESC,
        },
      },
    );
  }

  @FieldResolver({ nullable: true })
  async votes(@Root() post: Post) {
    return post.votes;
  }

  @FieldResolver()
  async author(@Root() post: Post, @Ctx() { em }: ContextType) {
    return await em.findOne(User, post.author.id);
  }

  @FieldResolver()
  async category(@Root() post: Post, @Ctx() { em }: ContextType) {
    return await em.findOne(Category, post.category.id);
  }
}
