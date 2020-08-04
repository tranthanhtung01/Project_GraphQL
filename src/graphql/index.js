import { GraphQLSchema } from 'graphql';
import query from './queries';
import mutation from './mutations';

export const graphQLSchema = new GraphQLSchema({ query, mutation });
