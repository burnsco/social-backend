import { GraphQLScalarType, Kind } from 'graphql';
import moment from 'moment';

export const CustomDate = new GraphQLScalarType({
  name: 'CustomDate',
  description: 'Convert ISO string from redis data',
  parseValue(value: string) {
    return moment(value).toDate(); // value from the client input variables
  },
  serialize(value: Date) {
    return moment(value).toISOString(); // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return moment(ast.value).toDate(); // value from the client query
    }
    return null;
  },
});
