import { Resolver, Query, Ctx, Mutation, Arg } from "type-graphql";
import type { TContext } from "@/app/api/graphql/types";
import {
  Message,
  Reply,
  WriteMessageInput,
  WriteReplyInput,
} from "./message.types";

@Resolver()
export class MessageResolver {
  @Query(() => [Message])
  async getMessages(@Ctx() ctx: TContext): Promise<Message[]> {
    return ctx.prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        replies: {
          include: { user: true },
        },
      },
    });
  }

  @Mutation(() => Message)
  async writeMessage(
    @Arg("input", () => WriteMessageInput)
    { content, isAnonymous }: WriteMessageInput,
    @Ctx() ctx: TContext
  ): Promise<Message> {
    return ctx.prisma.message.create({
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
    @Arg("input", () => WriteReplyInput)
    { content, isAnonymous, messageId }: WriteReplyInput,
    @Ctx() ctx: TContext
  ): Promise<Reply> {
    return ctx.prisma.reply.create({
      data: {
        content,
        isAnonymous,
        user: { connect: { id: ctx.id } },
        message: { connect: { id: messageId } },
      },
      include: { user: true },
    });
  }
}
