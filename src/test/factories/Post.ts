import type { Faker } from '@mikro-orm/seeder';
import { Factory } from '@mikro-orm/seeder';
import { Post } from '../../entities';

export class PostFactory extends Factory<Post> {
  model = Post;

  definition(faker: Faker): Partial<Post> {
    return {
      title: faker.lorem.sentence(),
      text: faker.lorem.paragraph(),
    };
  }
}
