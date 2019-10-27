import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { ApolloServer } from 'apollo-server-express';
import mongoDBConnection from './db';

import dotenv from 'dotenv';

import { typeDefs } from './mongoDBSchema';

import resolvers from './resolvers';

dotenv.config();
const {
  GRAPHQL_MONGO_LISTEN_PORT,
  GRAPHQL_MONGO_LISTEN_PATH,

  API_HOST
} = process.env;


const app = express();
app.use(bodyParser.json());
app.use(cors());


mongoDBConnection().then(() => {
  const schemaForMongoDBCompliance = {
    typeDefs,
    resolvers,
  };

  const serverWithMongo = new ApolloServer(schemaForMongoDBCompliance);
  serverWithMongo.applyMiddleware({
    app,
    path: GRAPHQL_MONGO_LISTEN_PATH
  });

  app.listen( { port: GRAPHQL_MONGO_LISTEN_PORT, host: API_HOST }, () =>
    console.log(`🚀 Server ready at http://${API_HOST}:${GRAPHQL_MONGO_LISTEN_PORT}${serverWithMongo.graphqlPath}`)
  );
});
