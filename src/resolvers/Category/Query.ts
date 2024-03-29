import { QueryOrder } from '@mikro-orm/core'
import { Args, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql'
import CategoryArgs from '../../args/category-args'
import CategoryArgsTest from '../../args/categoryArgs'
import { Category, User } from '../../entities'
import { ContextType } from '../../types'
import { _QueryMeta } from './../../common/_QueryMeta'

@Resolver(() => Category)
export default class CategoryQueryResolver {
  @Query(() => _QueryMeta)
  async numberOfCategories(@Root() @Ctx() { em }: ContextType) {
    const [, count] = await em.findAndCount(Category, {})
    return { count }
  }

  @Query(() => Category, { nullable: true })
  async category(
    @Args() { categoryId, name }: CategoryArgsTest,
    @Ctx() { em }: ContextType,
  ): Promise<Category | null> {
    let category
    if (categoryId) {
      category = await em.findOne(Category, categoryId, {
        populate: ['chatUsers'],
      })
      return category
    }
    if (name) {
      category = await em.findOne(Category, { name })
      return category
    }
    return null
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
      )
      if (categories) {
        return categories.filter(cat => cat.name.includes(name))
      }
      return categories
    }

    // TODO create a way to get # of cat for navbar
    // if (count) {
    //   return numberOfCategories
    // }

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
    )
    return categories
  }

  @FieldResolver(() => [User], { nullable: true })
  chatUsers(@Root() category: Category) {
    return category.chatUsers
  }
}
