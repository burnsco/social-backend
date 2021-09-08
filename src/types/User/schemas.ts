import * as Yup from "yup"

export const RegisterSchema = Yup.object({
  username: Yup.string()
    .min(2, "Must be at least 5 characters long")
    .max(15, "Must be 20 characters or less")
    .trim()
    .required("Required")
    .matches(/^[a-zA-Z0-9]+$/, "Cannot contain special characters or spaces"),

  email: Yup.string().email().trim().required("Required"),
  password: Yup.string()
    .min(4, "Must be at least 5 characters long")
    .max(15, "Must be 20 characters or less")
    .trim()
    .required("Required")
})

export const LoginSchema = Yup.object({
  password: Yup.string().trim().required("Required"),
  email: Yup.string().email().trim().required("Required")
})

export const EditUserSchema = Yup.object({
  userId: Yup.string().notRequired(),
  username: Yup.string().notRequired(),
  about: Yup.string().notRequired(),
  email: Yup.string().notRequired(),
  password: Yup.string().notRequired(),
  avatar: Yup.string().notRequired()
})
