"use client";

import { gql } from "@tf/codegen/__generated__";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";

import { Message } from "@/components/message";
import { Skeleton } from "@/components/ui/skeleton";

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
    upvotes {
      userId
    }
    replies {
      id
      content
      createdAt
      isAnonymous
      user {
        id
        username
      }
      upvotes {
        userId
      }
    }
  }
}
`);

export default function Home() {
  const { data, loading } = useQuery(GET_MESSAGES);

  if (loading) {
    return (
      <div className="container max-w-screen-sm space-y-12">
        {Array.from({ length: 5 }).map((_, i) => (
          <div className="space-y-2" key={i}>
            <div className="flex space-x-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
            <Skeleton className="h-4 w-[300px]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="pb-24">
      {data?.getMessages.map((m) => (
        <Message key={m.id} {...m} />
      ))}
    </section>
  );
}
