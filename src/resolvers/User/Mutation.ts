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
    @Arg('email') data: EditUserInput,
    @Ctx() { em }: ContextType,
  ): Promise<boolean> {
    const user = await em.findOne(User, { email: data.email })

    if (user) {
      const transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.ADMIN_EMAIL, // generated ethereal user
          pass: process.env.ADMIN_PASS, // generated ethereal password
        },
      })

      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Corey Burns 👻" <coreyburns@outlook.com>', // sender address
        to: 'coreymburns@gmail.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>', // html body
      })

      console.log('Message sent: %s', info.messageId)
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      return true
    }
    return false
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
