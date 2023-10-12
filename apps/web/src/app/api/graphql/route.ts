import "reflect-metadata";
import { NextRequest } from "next/server";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { getServerSession } from "next-auth/next";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

import prisma from "@/utils/db";
import { UserResolver } from "@/schema/user/user.resolvers";
import { authOptions } from "../auth/[...nextauth]/_options";
import { MessageResolver } from "@/schema/message/message.resolvers";

const schema = await buildSchema({
  resolvers: [UserResolver, MessageResolver],
});

const server = new ApolloServer({
  schema,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async () => {
    const session = await getServerSession(authOptions);
    const id = session?.user?.id;
    return { prisma, id };
  },
});

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
