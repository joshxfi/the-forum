"use client";

import { useQuery } from "@apollo/client";
import { gql } from "@theforum/codegen/__generated__";
import { signOut, useSession } from "next-auth/react";

import { Menu } from "@/components/menu";
import { Message } from "@/components/message";
import { Button } from "@/components/ui/button";

const USER = gql(`
query GetUser($username: String!) {
  getUser(username: $username) {
    id
    username
  }
}
`);

export default function Home() {
  const { data } = useQuery(USER, { variables: { username: "hellouser12" } });
  const { status, data: user } = useSession();

  return (
    <section className="pb-24">
      <div className="container max-w-screen-sm mb-12">
        <p>{JSON.stringify(data?.getUser, null, 2)}</p>
        <p>{status}</p>
        <p>{JSON.stringify(user, null, 2)}</p>
        <Button type="button" onClick={() => signOut({ redirect: false })}>
          Logout
        </Button>
      </div>

      <Message
        username="joe"
        content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis iure dolor dolorem quos blanditiis quibusdam aut pariatur ex quisquam vitae vel odit ratione labore, consequatur quasi quaerat aliquid! Impedit, sunt?"
        timestamp="2023-01-01"
        upvoteCount={10}
        replyCount={2}
      />

      <Message
        username="johnny"
        content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis iure dolor dolorem quos blanditiis quibusdam aut pariatur ex quisquam vitae vel odit ratione labore, consequatur quasi quaerat aliquid! Impedit, sunt?"
        timestamp="2023-02-04"
        upvoteCount={7}
        replyCount={4}
      />

      <Menu />
    </section>
  );
}
