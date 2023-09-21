import { IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { Directive, Field, ID, InputType, ObjectType } from "type-graphql";
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
class Upvote {
  @Field(() => ID)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => ID)
  userId: string;
}

@Directive("@cacheControl(maxAge: 60)")
@ObjectType()
export class Message extends BaseMessage {
  @Field(() => [Reply], { nullable: true })
  replies?: Reply[];

  @Field(() => [Upvote], { nullable: true })
  upvotes?: Upvote[];
}

@Directive("@cacheControl(maxAge: 60)")
@ObjectType()
export class Reply extends BaseMessage {
  @Field(() => [Upvote], { nullable: true })
  upvotes?: Upvote[];
}

@InputType()
export class WriteMessageInput {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(500)
  @Field(() => String)
  content: string;

  @Field(() => Boolean)
  isAnonymous: boolean;
}

@InputType()
export class WriteReplyInput extends WriteMessageInput {
  @Field(() => ID)
  messageId: string;
}
