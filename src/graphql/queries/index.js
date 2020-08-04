import { GraphQLObjectType, GraphQLString as String, } from 'graphql';
import { user, listUser } from './user';
import { isAuthenticated } from '../middleware';
import { middlewareResolver } from '../../utils';
import {courseList, courseListByAuthor} from "./courseQuery";

export default new GraphQLObjectType({
	name: 'Queries',
	fields: () => ({
		greeting,
		user: middlewareResolver(user, [isAuthenticated]),
		courseList,
		listUser,
		listCourseByAuthor : middlewareResolver(courseListByAuthor, [isAuthenticated]),
	}),
});

const greeting = {
	type: String,
	description: 'A warm welcome message from GraphQL, usually used to Test if the system working..',
	resolve: (rootValue, params, context) => {
		const { req } = context;
		return req.t('greetingQuery', { service: process.env.SERVICE_NAME });
	},
};
