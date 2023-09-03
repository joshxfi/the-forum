import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

import { UserResolver } from "@/schema/user/user.resolvers";

const schema = await buildSchema({
  resolvers: [UserResolver],
});

const server = new ApolloServer({
  schema,
});

const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };
