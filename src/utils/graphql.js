import moment from 'moment';
import {
	GraphQLString as String,
	GraphQLInt as Int,
	GraphQLFloat as Float,
	GraphQLBoolean as Boolean,
	GraphQLList as List,
	GraphQLNonNull as Required,
	graphql as runGraphQl,
	GraphQLObjectType,
	GraphQLError
} from 'graphql';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { combineResolvers } from 'graphql-resolvers';

import { introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';

const resolveId = (instance) => instance._id || instance.id;
const resolveDateTime = (instance, params, options, { fieldName }) => moment.utc(instance[fieldName]);
const resolve = (instance, params, options, { fieldName }) => instance[fieldName];

const generateResolver = (type, resolver = resolve) => {
	return (description = 'Self descriptive') => ({ type, description, resolve: resolver });
};

const generatePrimitive = (type, required = false, defaultValue = undefined) => {
	if (required) {
		return (description = 'Self descriptive') =>
			({ type: new Required(type), description, });
	}

	return (defaultValue = defaultValue, description = 'Self descriptive') =>
		({ type, description, defaultValue, });
};

export const Resolvers = {
	string: generateResolver(String),
	id: generateResolver(String, resolveId),
	int: generateResolver(Int),
	float: generateResolver(Float),
	boolean: generateResolver(Boolean),
	stringList: generateResolver(new List(String)),
	datetime: generateResolver(String, resolveDateTime),
	ofType: (type, description = 'Self descriptive', resolver = resolve) =>
		({ type, description, resolve: resolver, }),
	listOfType: (type, description = 'Self descriptive', resolver = resolve) =>
		({ type: new List(type), description, resolve: resolver, }),
};

export const Primitives = {
	string: generatePrimitive(String),
	requiredString: generatePrimitive(String, true),
	int: generatePrimitive(Int),
	requiredInt: generatePrimitive(Int, true, 0),
	float: generatePrimitive(Float),
	requiredFloat: generatePrimitive(Float, true, 0),
	boolean: generatePrimitive(Boolean),
	ofType: (type, defaultValue = undefined, description = 'Self descriptive') =>
		({ type, defaultValue, description, }),
	list: (type, defaultValue = [], description = 'Self descriptive') =>
		({ type: new List(type), defaultValue, description, }),
	requiredList: (type, defaultValue = [], description = 'Self descriptive') =>
		({ type: new Required(new List(type)), defaultValue, description, }),
};

export function executeGraphQl(schemas, query, rootValues = {}, context, variables = {}) {
	return runGraphQl(schemas, query, rootValues, context, variables);
}

export function mutationOf(dataType, name, description = 'Self descriptive') {
	return new GraphQLObjectType({
		name, description,
		fields: () => ({
			success: Resolvers.boolean('This flag to tell if the Mutation is success or not'),
			msg: Resolvers.string(),
			payload: Resolvers.ofType(dataType),
		}),
	});
}

export async function getIntrospectSchema(serviceName) {
	const isProduction = process.env.NODE_ENV === 'production';
	let introspectUrl = process.env.BASE_URL;
	if (!isProduction) {
		const { PORT } = dotenv.parse(fs.readFileSync(path.resolve(`${serviceName}Service.env`)));
		introspectUrl = `http://localhost:${PORT || 1337}/`;
	}
	const microServiceLinkHttp = createHttpLink({
			uri: `${introspectUrl}${serviceName}/graphql`,
			fetch,
		}),
		microServiceLinkWithContext = setContext((request, prevContext) => {
			const nextContext = {
				users: { foo: 'bar' }
			};
			if (prevContext?.graphqlContext?.req) {
				nextContext.headers = prevContext?.graphqlContext?.req.headers;
			}
			return nextContext;
		}).concat(microServiceLinkHttp),
		microServiceLink = onError(({response}) => {
			response.errors = response.errors.map(err => new GraphQLError(err.message))
		}).concat(microServiceLinkWithContext),
		microServiceRemoteSchema = await introspectSchema(microServiceLink);
	return makeRemoteExecutableSchema({
		schema: microServiceRemoteSchema,
		link: microServiceLink
	});
}

export function middlewareResolver(resolver, middleware) {
	return {
		...resolver,
		resolve: combineResolvers(...middleware, resolver.resolve),
	}
}
