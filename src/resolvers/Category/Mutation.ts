import { LoadStrategy } from "@mikro-orm/core"
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql"
import { subRedditNameInUse } from "../../common/constants"
import { Category, User } from "../../entities"
import { CategoryInput } from "../../inputs"
import { isAuth } from "../../lib/isAuth"
import { CategoryMutationResponse } from "../../responses"
import UserLeaveJoinSubResponse from "../../responses/subscription/user-leave-join-sub-response"
import { ContextType } from "../../types"

@Resolver(() => Category)
export default class CategoryMutationResolver {
  @Mutation(() => CategoryMutationResponse)
  @UseMiddleware(isAuth)
  async createCategory(
    @Arg("data") data: CategoryInput,
    @Ctx() { em }: ContextType
  ): Promise<CategoryMutationResponse> {
    const isNameInUse = await em.findOne(Category, { name: data.name })
    if (!isNameInUse) {
      const category = em.create(Category, {
        name: data.name
      })
      await em.persistAndFlush(category)

      return { category }
    }
    return {
      errors: [subRedditNameInUse]
    }
  }

  @Mutation(() => UserLeaveJoinSubResponse)
  @UseMiddleware(isAuth)
  async joinChatRoom(
    @Arg("data") data: CategoryInput,
    @Ctx() { em, req }: ContextType
  ): Promise<UserLeaveJoinSubResponse | null> {
    const user = await em.findOne(
      User,
      { id: req.session.userId },
      { populate: ["chatRooms"], strategy: LoadStrategy.JOINED }
    )
    const category = await em.findOne(
      Category,
      { name: data.name },
      { populate: ["chatUsers"], strategy: LoadStrategy.JOINED }
    )

    if (category && user && category.chatUsers.contains(user)) {
      return null
    }

    if (category && user) {
      category.chatUsers.add(user)
      user.chatRooms.add(category)
      await em.flush()
      return { category, user }
    } else {
      return null
    }
  }

  @Mutation(() => UserLeaveJoinSubResponse)
  @UseMiddleware(isAuth)
  async leaveChatRoom(
    @Arg("data") data: CategoryInput,
    @Ctx() { em, req }: ContextType
  ): Promise<UserLeaveJoinSubResponse | null> {
    const user = await em.findOne(
      User,
      { id: req.session.userId },
      { populate: ["chatRooms"], strategy: LoadStrategy.JOINED }
    )
    const category = await em.findOne(
      Category,
      { name: data.name },
      { populate: ["chatUsers"], strategy: LoadStrategy.JOINED }
    )
    if (
      category &&
      user &&
      category.chatUsers.contains(user) &&
      user.chatRooms.contains(category)
    ) {
      category.chatUsers.remove(user)
      user.chatRooms.remove(category)
      await em.flush()
      return { category, user }
    } else {
      return null
    }
  }
}
