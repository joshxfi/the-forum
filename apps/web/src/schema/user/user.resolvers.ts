import type { TContext } from "@/app/api/graphql/_types";
import { Resolver, Query, Mutation, Ctx, Arg } from "type-graphql";
import { User } from "./user.types";
import { hashPassword } from "@/utils/helpers";

@Resolver()
export class UserResolver {
  @Query(() => String)
  async hello() {
    return "Hello World";
  }

  @Query(() => User)
  async getUser(
    @Arg("username", () => String) username: string,
    @Ctx() { prisma }: TContext
  ): Promise<User> {
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: { username },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Query(() => User)
  async getCurrentUser(@Ctx() { prisma, id }: TContext): Promise<User> {
    try {
      if (!id) {
        throw new Error("Not authenticated");
      }

      const user = await prisma.user.findUniqueOrThrow({
        where: { id },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Mutation(() => User)
  async createUser(
    @Arg("username", () => String) username: string,
    @Arg("password", () => String) password: string,
    @Ctx() { prisma }: TContext
  ): Promise<User> {
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const hashedPassword = hashPassword(password);

    try {
      if (!usernameRegex.test(username)) {
        throw new Error("Username must be alphanumeric");
      }

      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (user) {
        throw new Error("Username already taken");
      }

      return await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
