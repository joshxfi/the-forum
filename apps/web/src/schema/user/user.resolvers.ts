import { Resolver, Query } from "type-graphql";

@Resolver()
export class UserResolver {
  @Query(() => String)
  async hello() {
    return "Hello World";
  }
}
