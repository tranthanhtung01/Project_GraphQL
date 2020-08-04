import { GraphQLObjectType } from 'graphql';
import { GraphQLString as String } from 'graphql/type/scalars';

import { signUp, signIn, verifyEmail } from './auth';
import {middlewareResolver} from "../../utils";
import {createCourse, updateCourse, removeCourse} from "./courseMutation";
import {isAuthenticated, isAuthorized} from "../middleware";

export default new GraphQLObjectType({
	name: 'Mutations',
	fields: () => ({
		greeting,
		signUp,
		signIn,
		createCourse: middlewareResolver(createCourse, [isAuthenticated]),
		verifyEmail: middlewareResolver(verifyEmail, [isAuthenticated]),
		updateCourse: middlewareResolver(updateCourse, [isAuthenticated, isAuthorized]),
		DeleteCourse: middlewareResolver(removeCourse, [isAuthenticated, isAuthorized]),
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
