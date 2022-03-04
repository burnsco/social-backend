import { Field, ID, InputType } from 'type-graphql';

@InputType()
export default class EditPostInput {
  @Field(() => ID)
  postId?: string;

  @Field(() => ID)
  categoryId?: string;

  @Field(() => String)
  title?: string;

  @Field(() => String, { nullable: true })
  text?: string;

  @Field(() => String, { nullable: true })
  image?: string;

  @Field(() => String, { nullable: true })
  link?: string;

  @Field(() => String, { nullable: true })
  imageH?: string;

  @Field(() => String, { nullable: true })
  imageW?: string;
}
