"use client";

import { nanoid } from "nanoid";
import { gql } from "@tf/codegen/__generated__";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";

import { Message } from "@/components/message";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const GET_MESSAGES = gql(`
query GetMessages($cursorId: ID) {
  getMessages(cursorId: $cursorId) {
    cursorId
    data {
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
}
`);

export default function Home() {
  const { toast } = useToast();
  const { data, loading, fetchMore } = useQuery(GET_MESSAGES);

  if (loading) {
    return (
      <div className="container max-w-screen-sm space-y-12">
        {Array.from({ length: 5 }).map((_) => (
          <div className="space-y-2" key={nanoid()}>
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
      {data?.getMessages.data.map((m) => (
        <Message key={m.id} {...m} />
      ))}

      <Button
        type="button"
        onClick={() => {
          toast({
            title: "stfu",
            description: data?.getMessages.cursorId,
          });

          fetchMore({
            variables: {
              cursorId: data?.getMessages.cursorId,
            },
          });
        }}
      >
        Load More
      </Button>
    </section>
  );
}
