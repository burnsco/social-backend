import {
  Arg,
  Args,
  Ctx,
  Mutation,
  PubSub,
  Publisher,
  Resolver,
  Root,
  Subscription,
  UseMiddleware,
} from 'type-graphql'
import PostArgs from '../../args/post-args'
import { Topic } from '../../common/topics'
import { Category, Post, User, Vote } from '../../entities'
import { CreatePostInput, EditPostInput, VoteInput } from '../../inputs'
import { isAuth } from '../../lib/isAuth'
import { PostMutationResponse, VoteMutationResponse } from '../../responses'
import { ContextType } from '../../types'

@Resolver(() => Post)
export default class PostMutationResolver {
  @Mutation(() => PostMutationResponse)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('data')
    { title, text, image, link, categoryId, imageH, imageW }: CreatePostInput,
    @PubSub(Topic.NewPost)
    notifyAboutNewPost: Publisher<Post>,
    @Ctx() { em, req }: ContextType,
  ): Promise<PostMutationResponse> {
    const category = await em.findOne(Category, { id: categoryId })
    if (!category) {
      return {
        errors: [
          {
            field: 'title',
            message: 'there was an error finding that category',
          },
        ],
      }
    }
    const post = em.create(Post, {
      createdAt: new Date(),
      updatedAt: new Date(),
      title,
      text,
      image,
      imageH,
      imageW,
      link,
      author: em.getReference(User, req.session.userId),
      category: em.getReference(Category, category.id),
    })
    await em.persistAndFlush(post)
    await notifyAboutNewPost(post)
    return { post }
  }

  @Mutation(() => PostMutationResponse)
  @UseMiddleware(isAuth)
  async editPost(
    @Arg('data')
    { title, text, image, link, postId, categoryId }: EditPostInput,
    @Ctx() { em }: ContextType,
  ): Promise<PostMutationResponse> {
    // #TODO optimize this later
    const errors = []
    const post = await em.findOneOrFail(Post, { id: postId })
    if (post) {
      if (categoryId) {
        post.category = em.getReference(Category, categoryId)
      }
      if (title) {
        post.title = title
      }
      if (text) {
        post.text = text
      }
      if (image) {
        post.image = image
      }
      if (link) {
        post.link = link
      }
      await em.flush()

      return {
        post,
      }
    }
    errors.push({
      field: 'title',
      message: 'post not found',
    })
    return {
      errors,
    }
  }

  @Mutation(() => PostMutationResponse)
  @UseMiddleware(isAuth)
  async deletePost(
    @Args() { postId }: PostArgs,
    @Ctx() { em, req }: ContextType,
  ): Promise<PostMutationResponse | boolean> {
    const post = await em.findOneOrFail(
      Post,
      { id: postId },
      {
        populate: ['comments', 'votes'],
      },
    )
    if (post && post.author.id === req.session.userId) {
      if (post?.comments) {
        post.comments.removeAll()
        if (post.votes) {
          post.votes.removeAll()
        }
        em.removeAndFlush(post)
        return {
          post,
        }
      }
      return false
    }
    return false
  }

  @Mutation(() => VoteMutationResponse)
  @UseMiddleware(isAuth)
  async vote(
    @Arg('data') { postId, value }: VoteInput,
    @Ctx() { em, req }: ContextType,
  ): Promise<VoteMutationResponse | null> {
    const post = await em.findOne(Post, postId, {
      populate: ['votes'],
    })
    if (!post) {
      return null
    }
    const didVote = await em.findOne(Vote, {
      castBy: req.session.userId,
      post: postId,
    })

    if (didVote && didVote.value === value) {
      post.votes.remove(didVote)
      await em.persistAndFlush(post)
      return {
        vote: didVote,
        post,
      }
    }

    if (didVote && didVote.value !== value) {
      didVote.value = value
      await em.persistAndFlush(didVote)
      await em.persistAndFlush(post)
      return {
        vote: didVote,
        post,
      }
    }

    const vote = em.create(Vote, {
      createdAt: new Date(),
      updatedAt: new Date(),
      post,
      value,
      castBy: em.getReference(User, req.session.userId),
    })
    post.votes.add(vote)

    await em.persistAndFlush(post)

    return {
      vote,
      post,
    }
  }

  // *** SUBSCRIPTION *** \\

  @Subscription(() => Post, {
    topics: Topic.NewPost,
  })
  newPost(@Root() newPost: Post): Post {
    return newPost
  }
}
