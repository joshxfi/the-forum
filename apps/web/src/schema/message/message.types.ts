import { IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { Directive, Field, ID, InputType, ObjectType } from "type-graphql";
import { User } from "../user/user.types";

@Directive("@cacheControl(maxAge: 60)")
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
