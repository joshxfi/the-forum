import { Post, Upvote } from "@generated/type-graphql";
import type { TContext } from "@/app/api/graphql/_types";
import { PostData, PostsWithCursor } from "./post.types";
import { Resolver, Query, Ctx, Mutation, Arg, ID } from "type-graphql";

@Resolver(() => Post)
export class PostResolver {
  @Query(() => PostsWithCursor)
  async getPosts(
    @Ctx() ctx: TContext,
    @Arg("cursorId", () => ID, { nullable: true }) cursorId?: string | null
  ): Promise<PostsWithCursor> {
    try {
      const posts = await ctx.prisma.post.findMany({
        where: { isComment: false },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          author: true,
          tags: true,
          upvotes: true,
          comments: {
            include: { author: true, upvotes: true },
          },
        },
        ...(cursorId && {
          skip: 1,
          cursor: {
            id: cursorId,
          },
        }),
      });

      if (posts.length === 0) {
        return {
          data: [],
          cursorId: "",
        };
      }

      return {
        data: posts,
        cursorId: posts[posts.length - 1].id,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Mutation(() => PostData)
  async addPost(
    @Arg("content", () => String) content: string,
    @Arg("isAnonymous", () => Boolean) isAnonymous: boolean,
    @Ctx() ctx: TContext
  ): Promise<PostData> {
    try {
      return await ctx.prisma.post.create({
        data: {
          content,
          isAnonymous,
          author: { connect: { id: ctx.id } },
        },
        include: { author: true },
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Mutation(() => PostData)
  async addComment(
    @Arg("content", () => String) content: string,
    @Arg("isAnonymous", () => Boolean) isAnonymous: boolean,
    @Arg("postId", () => ID) postId: string,
    @Ctx() ctx: TContext
  ): Promise<PostData> {
    try {
      const commentData = await ctx.prisma.post.create({
        data: {
          content,
          isAnonymous,
          isComment: true,
          author: { connect: { id: ctx.id } },
          parent: { connect: { id: postId } },
        },
        include: {
          author: true,
        },
      });

      return commentData;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Mutation(() => Upvote)
  async addUpvote(
    @Arg("postId", () => ID) postId: string,
    @Ctx() ctx: TContext
  ): Promise<Upvote> {
    try {
      return await ctx.prisma.upvote.create({
        data: {
          userId: ctx.id ?? "",
          post: { connect: { id: postId } },
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
