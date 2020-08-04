import { GraphQLObjectType } from 'graphql';
import { Resolvers } from '../../utils';

export const AccessTokenType = new GraphQLObjectType({
	name: 'AccessToken',
	description: 'Access Token',
	fields: () => ({
		accessToken: Resolvers.string(),
		verifyCode: Resolvers.int(),
	})
});
