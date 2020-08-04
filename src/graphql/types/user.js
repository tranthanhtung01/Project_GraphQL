import { GraphQLObjectType } from 'graphql';
import { Resolvers } from '../../utils';
import {CourseType} from "./course";

const timeoutPromise = (wait) => {
	return new Promise((resolve) => {
		setTimeout(resolve, wait);
	})
}

export const UserType = new GraphQLObjectType({
	name: 'User',
	description: 'Single User Type',
	fields: () => ({
		id: Resolvers.id(),
		email: Resolvers.string(),
		createdAt: Resolvers.datetime(),
		updatedAt: Resolvers.datetime(),
	})
});

export const CommentType = new GraphQLObjectType({
	name: 'Comment',
	description: 'Single Comment Type',
	fields: () => ({
		id: Resolvers.id(),
		comment: Resolvers.string(),
	})
})

export const UserListType = new GraphQLObjectType({
	name: 'userList',
	description: 'User List Type',
	fields: () =>({
		users: Resolvers.listOfType(UserType, '', userListResolve),
		page: Resolvers.int(),
		limit: Resolvers.int(),
		totalPage: Resolvers.int(),
		totalCount: Resolvers.int(),
		hasNextPage: Resolvers.boolean(),
	})
})
const userListResolve = async ({foundUsers}) =>{
	return foundUsers;
}
