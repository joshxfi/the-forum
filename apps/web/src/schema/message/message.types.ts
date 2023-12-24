import { Directive, Field, ID, ObjectType } from "type-graphql";
import { User } from "../user/user.types";

@ObjectType()
export class Upvote {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field(() => ID)
  userId: string;

  @Field(() => ID, { nullable: true })
  messageId?: string | null;

  @Field(() => ID, { nullable: true })
  replyId?: string | null;
}

@ObjectType()
export class Message {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  content: string;

  @Field()
  isAnonymous: boolean;

  @Field(() => User)
  user: User;

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

  @Field({ nullable: true })
  cursorId?: string;
}

@Directive("@cacheControl(maxAge: 86400)")
@ObjectType()
export class Reply {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  content: string;

  @Field()
  isAnonymous: boolean;

  @Field(() => User)
  user: User;

  @Field(() => [Upvote], { nullable: true })
  upvotes?: Upvote[];
}
