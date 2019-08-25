import { ApolloServer } from "apollo-server";
import { v1 as neo4j } from "neo4j-driver";
import { makeAugmentedSchema } from "neo4j-graphql-js";
import dotenv from "dotenv";

import { typeDefs } from './graphql-schema';


dotenv.config();

const schema = makeAugmentedSchema({
  typeDefs
});

const driver = neo4j.driver(
  process.env.NEO4J_URI || "bolt://localhost:7687",
  neo4j.auth.basic(
    process.env.NEO4J_USER || "neo4j",
    process.env.NEO4J_PASSWORD || "neo4j"
  )
);

const server = new ApolloServer({
  context: { driver },
  schema: schema
});

server
  .listen(process.env.GRAPHQL_LISTEN_PORT, process.env.API_HOST)
  .then(({ url }) => {
  console.log(`GraphQL API ready at ${url}`);
});
