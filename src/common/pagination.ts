import { registerEnumType } from 'type-graphql';

export enum OrderBy {
  ASC = 'asc',
  DESC = 'desc',
}
registerEnumType(OrderBy, {
  name: 'OrderBy',
});
