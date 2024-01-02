import { Post, User, Upvote, Tag } from "@generated/type-graphql";
import { Directive, Field, ObjectType } from "type-graphql";

@ObjectType()
export class PostData extends Post {
  @Field(() => User)
  author: User;

  @Field(() => [Upvote], { nullable: true })
  upvotes?: Upvote[];
}

@ObjectType()
export class PostWithComments extends PostData {
  @Field(() => [Tag], { nullable: true })
  tags?: Tag[];

  @Field(() => [PostData])
  comments: PostData[];
}

@ObjectType()
export class PostsWithCursor {
  @Directive("@cacheControl(maxAge: 86400)")
  @Field(() => [PostWithComments], { nullable: true })
  data?: PostWithComments[];

  @Field({ nullable: true })
  cursorId?: string;
}
