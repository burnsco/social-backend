import { LoadStrategy } from '@mikro-orm/core'
import argon2 from 'argon2'
import nodemailer from 'nodemailer'
import {
  Arg,
  Ctx,
  Mutation,
  Publisher,
  PubSub,
  Resolver,
  Root,
  Subscription,
  UseMiddleware,
} from 'type-graphql'
import { v4 } from 'uuid'
import {
  COOKIE_NAME,
  emailInUse,
  emailOrPasswordIsIncorrect,
  usernameInUse,
} from '../../common/constants'
import { Topic } from '../../common/topics'
import { User } from '../../entities'
import { EditUserInput, LoginInput, RegisterInput } from '../../inputs'
import AddUserInput from '../../inputs/add-user-input'
import { isAuth } from '../../lib/isAuth'
import {
  UserLogoutMutationResponse,
  UserMutationResponse,
} from '../../responses'
import AddUserMutationResponse from '../../responses/mutation/add-friend-mutation-response'
import { ContextType } from '../../types'

@Resolver(() => User)
export default class UserMutationResolver {
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { em, redis }: ContextType,
  ): Promise<boolean> {
    const user = await em.findOne(User, { email })

    if (user) {
      const token = v4()

      await redis.set(
        `forget-password:` + token,
        user.id,
        'ex',
        1000 * 60 * 60 * 24 * 3,
      ) // 3 days

      console.log('token')
      console.log(token)
      const transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.ADMIN_EMAIL,
          pass: process.env.ADMIN_PASS,
        },
      })
      const info = await transporter.sendMail({
        from: '"Admin@Social 👻" <coreyburns@outlook.com>',
        to: user.email,
        subject: 'Forgot Password',
        html: `
        <p>Did you forget your password? Then click the link below.</p>
        <p>
        <a href="http://localhost:3000/change-password/${token}">reset password</a>
        </p>
        `,
      })
      console.log('email info')
      console.log(info)
      return true
    }
    return false
  }

  @Mutation(() => UserMutationResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { redis, req, em }: ContextType,
  ): Promise<UserMutationResponse | null> {
    if (newPassword.length <= 2) {
      return {
        errors: [
          {
            field: 'newPassword',
            message: 'length must be greater than 2',
          },
        ],
      }
    }

    const key = `forget-password:` + token
    const userId = await redis.get(key)
    if (!userId) {
      return {
        errors: [
          {
            field: 'token',
            message: 'token expired',
          },
        ],
      }
    }
    const user = await em.findOneOrFail(User, { id: userId })
    if (!user) {
      return {
        errors: [
          {
            field: 'token',
            message: 'user no longer exists',
          },
        ],
      }
    }

    user.password = await argon2.hash(newPassword)

    await redis.del(key)

    await em.persistAndFlush(user)

    req.session.userId = user.id

    return {
      user,
    }
  }

  @Mutation(() => UserMutationResponse)
  async register(
    @Arg('data') { email, username, password }: RegisterInput,
    @PubSub(Topic.NewUser)
    notifyAboutNewUser: Publisher<Partial<User>>,
    @Ctx() { em, req }: ContextType,
  ): Promise<UserMutationResponse | null | boolean> {
    const errors = []
    const isUserTaken = await em.findOne(User, { username })
    const isEmailTaken = await em.findOne(User, { email })

    if (isUserTaken || isEmailTaken) {
      if (isUserTaken) {
        errors.push(usernameInUse)
      }
      if (isEmailTaken) {
        errors.push(emailInUse)
      }
      return {
        errors,
      }
    }
    const user = em.create(User, {
      createdAt: new Date(),
      updatedAt: new Date(),
      online: true,
      email,
      username,
      password: await argon2.hash(password),
    })

    await em.persistAndFlush(user)
    await notifyAboutNewUser(user)

    req.session.userId = user.id

    return {
      user,
    }
  }

  @Mutation(() => UserMutationResponse)
  @UseMiddleware(isAuth)
  async editUser(
    @Arg('data') data: EditUserInput,
    @Ctx() { em, req }: ContextType,
  ): Promise<UserMutationResponse> {
    const user = await em.findOneOrFail(User, { id: req.session.userId })

    if (data.username) {
      user.username = data.username
    }
    if (data.about) {
      user.about = data.about
    }
    if (data.email) {
      user.email = data.email
    }
    if (data.password) {
      user.password = await argon2.hash(data.password)
    }
    if (data.avatar) {
      user.avatar = data.avatar
    }
    await em.flush()
    return {
      user,
    }
  }

  @Mutation(() => AddUserMutationResponse)
  @UseMiddleware(isAuth)
  async addFriend(
    @Arg('data') data: AddUserInput,
    @Ctx() { em, req }: ContextType,
  ): Promise<AddUserMutationResponse> {
    const me = await em.findOne(
      User,
      { id: req.session.userId },
      { populate: ['friends'], strategy: LoadStrategy.JOINED },
    )
    const friend = await em.findOne(
      User,
      { username: data.username },
      { populate: ['friends'], strategy: LoadStrategy.JOINED },
    )
    if (me && friend && me.friends.contains(friend)) {
      return {
        errors: [
          {
            field: 'username',
            message: `${friend.username} is already a friend`,
          },
        ],
      }
    }
    if (friend === me) {
      return {
        errors: [{ field: 'username', message: 'Cannot add yourself' }],
      }
    }
    if (!friend || !me) {
      return {
        errors: [{ field: 'username', message: 'User Not Found' }],
      }
    }
    if (me && friend) {
      me.friends.add(friend)
      friend.friends.add(me)
    }
    await em.flush()
    return {
      friend,
      me,
    }
  }

  @Mutation(() => UserMutationResponse)
  async login(
    @Arg('data') { email, password }: LoginInput,
    @Ctx() { em, req }: ContextType,
  ): Promise<UserMutationResponse | null> {
    const user = await em.findOne(User, { email })
    if (!user) {
      return {
        errors: [emailOrPasswordIsIncorrect],
      }
    }
    const valid = await argon2.verify(user.password, password)
    if (!valid) {
      return { errors: [emailOrPasswordIsIncorrect] }
    }
    if (valid) {
      req.session.userId = user.id
    }
    return {
      user,
    }
  }

  @Mutation(() => UserLogoutMutationResponse)
  @UseMiddleware(isAuth)
  logout(@Ctx() { req, res }: ContextType) {
    return new Promise(resolve =>
      req.session.destroy((err: any) => {
        res.clearCookie(COOKIE_NAME)
        if (err) {
          resolve(false)
          return {
            message: err,
            code: false,
          }
        }
        resolve(true)
        return {
          message: 'user logged out successfully',
          code: true,
        }
      }),
    )
  }

  @Subscription(() => User, {
    topics: Topic.NewUser,
  })
  newUser(@Root() newUser: User): User {
    return newUser
  }
}
