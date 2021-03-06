import { QueryOrder } from '@mikro-orm/core';
import { Args, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import CategoryArgs from '../../args/category-args';
import NewMessageArgs from '../../args/message-args';
import { Category, User } from '../../entities';
import { ContextType } from '../../types';

@Resolver(() => Category)
export default class CategoryQueryResolver {
  @Query(() => Category, { nullable: true })
  async category(
    @Args() { categoryId }: NewMessageArgs,
    @Ctx() { em }: ContextType,
  ): Promise<Category | null> {
    const category = await em.findOne(Category, categoryId, {
      populate: ['chatUsers'],
    });
    if (!category) {
      return null;
    }
    return category;
  }

  @Query(() => [Category], { nullable: true })
  async categories(
    @Args() { first, skip, name, orderBy }: CategoryArgs,
    @Ctx() { em }: ContextType,
  ): Promise<Category[] | null> {
    if (name) {
      const [categories] = await em.findAndCount(
        Category,
        {},
        {
          limit: first,
          offset: skip,
          orderBy: {
            createdAt: orderBy === 'asc' ? QueryOrder.ASC : QueryOrder.DESC,
          },
        },
      );
      if (categories) {
        return categories.filter(cat => cat.name.includes(name));
      }
      return categories;
    }

    const [categories] = await em.findAndCount(
      Category,
      {},
      {
        limit: first,
        offset: skip,
        orderBy: {
          createdAt: orderBy === 'asc' ? QueryOrder.ASC : QueryOrder.DESC,
        },
      },
    );
    return categories;
  }

  @FieldResolver(() => [User], { nullable: true })
  chatUsers(@Root() category: Category) {
    return category.chatUsers;
  }
}
