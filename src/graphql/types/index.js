import  {GraphQLObjectType } from 'graphql';
import { Resolvers} from "../../utils";

export * from './user';
export * from './accessToken';
export * from './course';

export const MessageTpe = new  GraphQLObjectType({
    name:'MessageType', description:'Message Type response includes success and msg only',
    fields: () => ({
        success: Resolvers.boolean('This flag to tell if the Mutation is success or not'),
        msg: Resolvers.string(),
    }),
});

