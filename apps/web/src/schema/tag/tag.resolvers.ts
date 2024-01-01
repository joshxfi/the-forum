import { Tag } from "@generated/type-graphql";
import type { TContext } from "@/app/api/graphql/_types";
import { Arg, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";

@Resolver(() => Tag)
export class TagResolver {
  @Query(() => [Tag])
  async getTags(@Ctx() ctx: TContext): Promise<Tag[]> {
    try {
      return await ctx.prisma.tag.findMany();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Mutation(() => Tag)
  async addTag(
    @Ctx() ctx: TContext,
    @Arg("name", () => String) name: string
  ): Promise<Tag> {
    try {
      return await ctx.prisma.tag.create({
        data: {
          name,
        },
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Mutation(() => String)
  async removeTag(
    @Ctx() ctx: TContext,
    @Arg("id", () => ID) id: string
  ): Promise<String> {
    try {
      await ctx.prisma.tag.delete({
        where: { id },
      });

      return "Success";
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
