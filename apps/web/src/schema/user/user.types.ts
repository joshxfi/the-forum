import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  username: string | null;

  @Field(() => String, { nullable: true })
  password: string | null;
}
