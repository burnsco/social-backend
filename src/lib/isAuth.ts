import type { MiddlewareFn } from 'type-graphql';
import type { ContextType } from '../types';

export const isAuth: MiddlewareFn<ContextType> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error('not authenticated');
  }

  return next();
};
