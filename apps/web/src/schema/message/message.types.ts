import { Directive, Field, ID, Int, ObjectType } from "type-graphql";
import { User } from "../user/user.types";

@ObjectType()
export class Upvote {
  @Field(() => ID)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => ID)
  userId: string;

  @Field(() => ID, { nullable: true })
  messageId?: string | null;

  @Field(() => ID, { nullable: true })
  replyId?: string | null;
}

@ObjectType()
class Count {
  @Field(() => Int)
  upvotes: number;

  @Field(() => Int)
  replies: number;
}

@ObjectType()
export class Message {
  @Field(() => ID)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => String)
  content: string;

  @Field(() => Boolean)
  isAnonymous: boolean;

  @Field(() => User)
  user: User;

  @Field(() => Count, { nullable: true })
  _count?: Count;

  @Field(() => [Reply], { nullable: true })
  replies?: Reply[];

  @Field(() => [Upvote], { nullable: true })
  upvotes?: Upvote[];
}

@ObjectType()
export class MessagesData {
  @Directive("@cacheControl(maxAge: 86400)")
  @Field(() => [Message], { nullable: true })
  data?: Message[];

  @Field(() => String, { nullable: true })
  cursorId: string | null;
}

@Directive("@cacheControl(maxAge: 86400)")
@ObjectType()
export class Reply {
  @Field(() => ID)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => String)
  content: string;

  @Field(() => Boolean)
  isAnonymous: boolean;

  @Field(() => User)
  user: User;

  @Field(() => [Upvote], { nullable: true })
  upvotes?: Upvote[];
}
