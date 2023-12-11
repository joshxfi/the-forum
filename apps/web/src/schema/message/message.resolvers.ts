import { Resolver, Query, Ctx, Mutation, Arg, ID } from "type-graphql";
import type { TContext } from "@/app/api/graphql/_types";
import { Message, Reply, Upvote } from "./message.types";

@Resolver()
export class MessageResolver {
  @Query(() => [Message])
  async getMessages(@Ctx() ctx: TContext): Promise<Message[]> {
    return await ctx.prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        upvotes: true,
        replies: {
          include: { user: true, upvotes: true },
        },
      },
    });
  }

  @Mutation(() => Message)
  async writeMessage(
    @Arg("content", () => String) content: string,
    @Arg("isAnonymous", () => Boolean) isAnonymous: boolean,
    @Ctx() ctx: TContext
  ): Promise<Message> {
    return await ctx.prisma.message.create({
      data: {
        content,
        isAnonymous,
        user: { connect: { id: ctx.id } },
      },
      include: { user: true },
    });
  }

  @Mutation(() => Reply)
  async writeReply(
    @Arg("content", () => String) content: string,
    @Arg("isAnonymous", () => Boolean) isAnonymous: boolean,
    @Arg("messageId", () => ID) messageId: string,
    @Ctx() ctx: TContext
  ): Promise<Reply> {
    return await ctx.prisma.reply.create({
      data: {
        content,
        isAnonymous,
        user: { connect: { id: ctx.id } },
        message: { connect: { id: messageId } },
      },
      include: { user: true },
    });
  }

  @Mutation(() => Reply)
  async addUpvote(
    @Arg("messageId", () => String) messageId: string,
    @Arg("type", () => String) type: "message" | "reply",
    @Ctx() ctx: TContext
  ): Promise<Upvote> {
    return ctx.prisma.upvote.create({
      data:
        type === "message"
          ? {
              user: { connect: { id: ctx.id } },
              message: { connect: { id: messageId } },
            }
          : {
              user: { connect: { id: ctx.id } },
              reply: { connect: { id: messageId } },
            },
    });
  }
}
