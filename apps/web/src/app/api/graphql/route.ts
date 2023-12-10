import "reflect-metadata";
import { NextRequest } from "next/server";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { getServerSession } from "next-auth/next";
import responseCachePlugin from "@apollo/server-plugin-response-cache";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

import prisma from "@/utils/db";
import { UserResolver } from "@/schema/user/user.resolvers";
import { MessageResolver } from "@/schema/message/message.resolvers";

import { authOptions } from "../auth/[...nextauth]/_options";

const schema = await buildSchema({
  resolvers: [UserResolver, MessageResolver],
  validate: true,
});

const server = new ApolloServer({
  schema,
  plugins: [responseCachePlugin()],
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => {
    const session = await getServerSession(authOptions);
    const id = session?.user?.id;
    return { req, prisma, id };
  },
});

export { handler as GET, handler as POST };
