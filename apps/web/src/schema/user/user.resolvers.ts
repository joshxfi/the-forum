import type { TContext } from "@/app/api/graphql/types";
import { Resolver, Query, Mutation, Ctx, Arg } from "type-graphql";
import { User } from "./user.types";
import { hashPassword } from "@/utils/helpers";

@Resolver()
export class UserResolver {
  @Query(() => String)
  async hello() {
    return "Hello World";
  }

  @Mutation(() => User)
  async createUser(
    @Arg("username", () => String) username: string,
    @Arg("password", () => String) password: string,
    @Ctx() { prisma }: TContext
  ) {
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

      await prisma.user.create({
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
