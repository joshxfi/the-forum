import type { TContext } from "@/app/api/graphql/_types";
import { Resolver, Query, Ctx, Mutation, Arg, ID } from "type-graphql";
import { Message, MessagesData, Reply, Upvote } from "./message.types";

@Resolver()
export class MessageResolver {
  @Query(() => MessagesData)
  async getMessages(
    @Ctx() ctx: TContext,
    @Arg("cursorId", () => ID, { nullable: true }) cursorId?: string | null
  ): Promise<MessagesData> {
    try {
      const messages = await ctx.prisma.message.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          user: true,
          upvotes: true,
          replies: {
            include: { user: true, upvotes: true },
          },
        },
        ...(cursorId && {
          skip: 1,
          cursor: {
            id: cursorId,
          },
        }),
      });

      if (messages.length === 0) {
        return {
          data: [],
          cursorId: "",
        };
      }

      return {
        data: messages,
        cursorId: messages[messages.length - 1].id,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Mutation(() => Message)
  async writeMessage(
    @Arg("content", () => String) content: string,
    @Arg("isAnonymous", () => Boolean) isAnonymous: boolean,
    @Ctx() ctx: TContext
  ): Promise<Message> {
    try {
      return await ctx.prisma.message.create({
        data: {
          content,
          isAnonymous,
          user: { connect: { id: ctx.id } },
        },
        include: { user: true },
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Mutation(() => Reply)
  async writeReply(
    @Arg("content", () => String) content: string,
    @Arg("isAnonymous", () => Boolean) isAnonymous: boolean,
    @Arg("messageId", () => ID) messageId: string,
    @Ctx() ctx: TContext
  ): Promise<Reply> {
    try {
      return await ctx.prisma.reply.create({
        data: {
          content,
          isAnonymous,
          user: { connect: { id: ctx.id } },
          message: { connect: { id: messageId } },
        },
        include: { user: true },
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Mutation(() => Upvote)
  async addUpvote(
    @Arg("messageId", () => ID) messageId: string,
    @Arg("type", () => String) type: "message" | "reply",
    @Ctx() ctx: TContext
  ): Promise<Upvote> {
    try {
      return await ctx.prisma.upvote.create({
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
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Mutation(() => String)
  async removeUpvote(
    @Arg("id", () => ID) id: string,
    @Ctx() ctx: TContext
  ): Promise<String> {
    try {
      await ctx.prisma.upvote.delete({
        where: {
          id,
        },
      });

      return "Success";
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
