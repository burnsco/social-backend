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
} from 'type-graphql'
import NewCommentsArgs from '../../args/comment-args'
import {
  commentNotFound,
  postNotFound,
  userNotFound,
} from '../../common/constants'
import { Topic } from '../../common/topics'
import { Comment, Post, User } from '../../entities'
import { CommentInput } from '../../inputs'
import { isAuth } from '../../lib/isAuth'
import { CommentMutationResponse } from '../../responses'
import { ContextType } from '../../types'

@Resolver(() => Comment)
export default class CommentMutationResolver {
  @Mutation(() => CommentMutationResponse)
  @UseMiddleware(isAuth)
  async createComment(
    @Arg('data') { body, postId }: CommentInput,
    @PubSub(Topic.NewComment)
    notifyAboutNewComment: Publisher<Comment>,
    @Ctx() { em, req }: ContextType,
  ): Promise<CommentMutationResponse> {
    const post = await em.findOne(
      Post,
      { id: postId },
      {
        populate: ['comments'],
      },
    )
    if (!post) {
      return { errors: [postNotFound] }
    }

    const user = await em.findOne(User, { id: req.session.userId })
    if (!user) {
      return { errors: [userNotFound] }
    }

    const comment = em.create(Comment, {
      createdAt: new Date(),
      updatedAt: new Date(),
      post: em.getReference(Post, post.id),
      body,
      createdBy: em.getReference(User, user.id),
    })
    em.persist(post)

    post.comments.add(comment)

    await em.flush()
    await notifyAboutNewComment(comment)

    return {
      post,
      comment,
    }
  }

  @Mutation(() => CommentMutationResponse)
  @UseMiddleware(isAuth)
  async editComment(
    @Arg('data') { body, postId }: CommentInput,
    @Ctx() { em }: ContextType,
  ): Promise<CommentMutationResponse> {
    const post = await em.findOneOrFail(Post, postId)
    const comment = await em.findOneOrFail(Comment, { post: { id: postId } })
    if (!comment) {
      return {
        errors: [commentNotFound],
      }
    }
    if (!post) {
      return {
        errors: [postNotFound],
      }
    }
    comment.body = body
    await em.flush()
    return {
      post,
      comment,
    }
  }

  // *** SUBSCRIPTION *** \\

  @Subscription(() => Comment, {
    topics: Topic.NewComment,
    filter: ({ payload, args }) => {
      return payload.post === args.postId
    },
  })
  newMessage(
    @Root() newComment: Comment,
    @Args() { postId }: NewCommentsArgs,
  ): Comment {
    return newComment
  }
}
