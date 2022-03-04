import * as Yup from 'yup';

export const CreatePostSchema = Yup.object({
  categoryId: Yup.string().required('Required'),
  title: Yup.string()
    .min(5, 'Must be at least 5 characters')
    .max(20, 'Must be 20 characters or less.')
    .required('Required'),
  text: Yup.string().notRequired(),
  link: Yup.string().url().notRequired(),
  video: Yup.string().notRequired(),
  image: Yup.string().notRequired(),
});

export const EditPostSchema = Yup.object({
  categoryId: Yup.number().notRequired(),
  postId: Yup.string().notRequired(),
  title: Yup.string()
    .min(5)
    .min(5, 'Must be at least 5 characters')
    .max(20, 'Must be 20 characters or less.')
    .notRequired(),
  link: Yup.string().url().notRequired(),
  text: Yup.string().notRequired(),
});
