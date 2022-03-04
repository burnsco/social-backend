export const __prod__ = process.env.NODE_ENV === 'production';

export const COOKIE_NAME = 'reddit';

// USER
export const usernameInUse = {
  field: 'username',
  message: 'Username is in use.',
};

export const usernameAvailable = {
  field: 'username',
  message: 'Username available.',
};

export const emailOrPasswordIsIncorrect = {
  field: 'email',
  message: 'Email and/or Password is incorrect.',
};

export const emailInUse = {
  field: 'email',
  message: 'Email is in use.',
};

export const emailAvailable = {
  field: 'email',
  message: 'Email not in use.',
};

// CATEGORY
export const subRedditNameInUse = {
  field: 'name',
  message: 'Subreddit name is already in use.',
};

export const commentNotFound = {
  field: 'Comment Not Found',
  message: 'Comment Not Found!',
};

export const postNotFound = {
  field: 'Post',
  message: 'Post Not Found!',
};

export const userNotFound = {
  field: 'body',
  message: 'user not found',
};
