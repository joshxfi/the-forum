import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { getSession } from "next-auth/react";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

import prisma from "@/utils/db";
import { UserResolver } from "@/schema/user/user.resolvers";

const schema = await buildSchema({
  resolvers: [UserResolver],
});

const server = new ApolloServer({
  schema,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req) => {
    const session = await getSession({ req });
    const id = session?.user?.id;
    return { prisma, id };
  },
});

export { handler as GET, handler as POST };
