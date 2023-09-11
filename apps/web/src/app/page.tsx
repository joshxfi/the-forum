"use client";

import { useQuery } from "@apollo/client";
import { Message } from "@/components/message";
import { gql } from "@tf/codegen/__generated__";

const GET_MESSAGES = gql(`
query GetMessages {
  getMessages {
    id
    content
    createdAt
    isAnonymous
    user {
      id
      username
    }
  }
}
`);

export default function Home() {
  const { data } = useQuery(GET_MESSAGES);

  return (
    <section className="pb-24">
      {data?.getMessages.map((m) => (
        <Message
          key={m.id}
          content={m.content}
          replyCount={0}
          upvoteCount={0}
          timestamp={m.createdAt}
          username={m.user.username!}
        />
      ))}
    </section>
  );
}
