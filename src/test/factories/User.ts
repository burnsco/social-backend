import type { Faker } from '@mikro-orm/seeder';
import { Factory } from '@mikro-orm/seeder';
import { User } from '../../entities';

export class UserFactory extends Factory<User> {
  model = User;

  definition(faker: Faker): Partial<User> {
    return {
      email: faker.internet.email(),
      username: faker.random.word(),
      password: faker.datatype.uuid(),
      online: true,
    };
  }
}
