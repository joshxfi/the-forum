/* eslint-disable no-unused-vars */
import "next-auth";
import prisma from "@/utils/db";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      username?: string;
    };
  }

  interface User {
    username: string;
  }
}

export interface TContext {
  prisma: typeof prisma;
  id?: string;
}
