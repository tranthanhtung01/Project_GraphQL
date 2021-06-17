import { GraphQLObjectType } from 'graphql';
import { GraphQLString as String } from 'graphql/type/scalars';

import { signUp, signIn, verifyEmail } from './auth';
import {middlewareResolver} from "../../utils";
import {createCourse, updateCourse, removeCourse} from "./courseMutation";
import {isAuthenticated, isAuthorized,isUserActivated} from "../middleware";

export default new GraphQLObjectType({
	name: 'Mutations',
	fields: () => ({
		greeting,
		signUp,
		signIn,
		createCourse: middlewareResolver(createCourse, [isAuthenticated, isUserActivated]),
		verifyEmail: middlewareResolver(verifyEmail, [isAuthenticated]),
		updateCourse: middlewareResolver(updateCourse, [isAuthenticated, isAuthorized]),
		deleteCourse: middlewareResolver(removeCourse, [isAuthenticated, isAuthorized]),
	}),
});

const greeting = {
	type: String,
	description: 'A warm welcome message from GraphQL, usually used to Test if the system working..',
	resolve: (rootValue, params, context) => {
		const { req } = context;
		return req.t('greetingMutation', { service: process.env.SERVICE_NAME });
	},
};
