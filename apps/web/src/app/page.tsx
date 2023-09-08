"use client"
import { gql } from "@theforum/codegen/__generated__";

import { Menu } from "@/components/menu";
import { Message } from "@/components/message";
import { useQuery } from "@apollo/client";

const HELLO = gql(`
query hello {
  hello
}
`);

export default function Home() {
  const { data } = useQuery(HELLO);

  return (
    <section className="pb-24">
      <p>{data?.hello}</p>

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
