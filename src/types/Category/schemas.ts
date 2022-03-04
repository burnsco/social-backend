import * as Yup from 'yup';

export const CategorySchema = Yup.object({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(15, 'Too Long!')
    .trim()
    .required('Required'),
});
