import { faker } from '@faker-js/faker'
import type { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import Category from '../entities/Category'
import Post from '../entities/Post'
import User from '../entities/User'

const categories = [
  'abstract',
  'animals',
  'business',
  'cats',
  'city',
  'fashion',
  'food',
  'nature',
  'nightlife',
  'people',
  'sports',
  'technics',
  'transport',
]

const numbPosts = 50
const imageHeight = 1650
const imageW = 1080

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    categories.forEach(category => {
      const cat = em.create(Category, {
        createdAt: new Date(),
        updatedAt: new Date(),
        name: category,
      })
      for (let index = 0; index < numbPosts; index++) {
        const user = em.create(User, {
          avatar: faker.image.avatar(),
          about: faker.random.words(14),
          createdAt: new Date(),
          updatedAt: new Date(),
          online: true,
          username: faker.internet.userName(),
          password: faker.internet.password(),
          email: faker.internet.email(),
        })
        const post = em.create(Post, {
          createdAt: new Date(),
          updatedAt: new Date(),
          title: faker.random.words(4),
          text: faker.random.words(20),
          author: em.getReference(User, user.id),
          category: em.getReference(Category, cat.id),
        })
      }
    })
  }
}
