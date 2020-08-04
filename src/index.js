import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { graphQLSchema } from './graphql';
import cors from 'cors';
import bodyParser from 'body-parser';
import { i18next, i18nextMiddleware } from './utils/i18n';
import { authenticationMiddleware } from './middleware/authentication';

dotenv.config();

import './mongoose';

const graphQlPath = `/graphql`;

const app = express();

app.use(morgan('dev'));

app.use(
	graphQlPath,
	cors(),
	bodyParser.json(),
	authenticationMiddleware,
	i18nextMiddleware.handle(i18next),
);

const server = new ApolloServer({
	schema: graphQLSchema,
	context: ({ req }) => {
		return { req };
	}
});

server.applyMiddleware({ app, path: graphQlPath });

app.listen(process.env.PORT || 3006, () => {
	console.log(`Server listen on port ${process.env.PORT || 3006}`);
});
