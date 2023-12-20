import { Directive, Field, ID, ObjectType } from "type-graphql";
import { User } from "../user/user.types";

@ObjectType()
class BaseMessage {
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
}

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
export class Message extends BaseMessage {
  @Field(() => [Reply], { nullable: true })
  replies?: Reply[];

  @Field(() => [Upvote], { nullable: true })
  upvotes?: Upvote[];
}

@ObjectType()
export class MessagesData {
  @Field(() => [Message])
  data: Message[];

  @Directive("@cacheControl(maxAge: 86400)")
  @Field(() => String, { nullable: true })
  cursorId: string | null;
}

@Directive("@cacheControl(maxAge: 86400)")
@ObjectType()
export class Reply extends BaseMessage {
  @Field(() => [Upvote], { nullable: true })
  upvotes?: Upvote[];
}
