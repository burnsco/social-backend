import { EntityManager } from "@mikro-orm/core"
import { Category, Post, User, Vote } from "../entities"

export async function seedDatabase(em: EntityManager) {
  const defaultUser = em.create(User, {
    email: "test2@github.com",
    username: "testUser2",
    password: "test123"
  })
  em.persistAndFlush(defaultUser)

  const category = em.create(Category, {
    name: "react2"
  })
  em.persist(category)

  const post1 = em.create(Post, {
    title: "First Post on React",
    author: defaultUser,
    category: category
  })
  em.persist(post1)

  post1.votes.add(
    em.create(Vote, { value: 1, user: defaultUser }),
    em.create(Vote, { value: 1, user: defaultUser })
  )

  await em.flush()

  return { defaultUser }
}
