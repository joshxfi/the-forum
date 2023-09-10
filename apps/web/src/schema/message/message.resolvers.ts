import { Resolver, Query, Ctx, Mutation, Arg } from "type-graphql";
import type { TContext } from "@/app/api/graphql/types";
import { Message, WriteMessageInput } from "./message.types";

@Resolver()
export class MessageResolver {
  @Query(() => [Message])
  async getMessages(@Ctx() ctx: TContext): Promise<Message[]> {
    return ctx.prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });
  }

  @Mutation(() => Message)
  async writeMessage(
    @Arg("input", () => WriteMessageInput)
    { content, isAnonymous }: WriteMessageInput,
    @Ctx() ctx: TContext
  ): Promise<Message> {
    console.log("User ID: ", ctx.id);
    return ctx.prisma.message.create({
      data: {
        content,
        isAnonymous,
        user: { connect: { id: ctx.id } },
      },
      include: { user: true },
    });
  }
}
