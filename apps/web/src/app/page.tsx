"use client";

import { nanoid } from "nanoid";
import { useEffect } from "react";
import { gql } from "@tf/codegen/__generated__";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";

import { Message } from "@/components/message";
import { Skeleton } from "@/components/ui/skeleton";
import { useMessageStore } from "@/store/useMessageStore";

const GET_POSTS = gql(`
query GetPosts($cursorId: ID) {
  getPosts(cursorId: $cursorId) {
    cursorId
    data {
      id
      content
      createdAt
      isAnonymous
      author {
        id
        username
      }
      upvotes {
        id
        userId
      }
      comments {
        id
        content
        createdAt
        isAnonymous
        author {
          id
          username
        }
        upvotes {
          id
          userId
        }
      }
    }
  }
}
`);

export default function Home() {
  const { ref, inView } = useInView();
  const { data, loading, fetchMore } = useQuery(GET_POSTS);
  const tempMessages = useMessageStore((state) => state.tempMessages);

  useEffect(() => {
    if (inView) {
      fetchMore({
        variables: {
          cursorId: data?.getPosts.cursorId,
        },
      });
    }
  }, [inView, fetchMore, data?.getPosts.cursorId]);

  if (loading) {
    return (
      <div className="space-y-12 container">
        {Array.from({ length: 6 }).map((_) => (
          <div className="space-y-2" key={nanoid()}>
            <div className="flex space-x-2">
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
            <Skeleton className="h-4 w-[300px]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="pb-24">
      {tempMessages.map((m) => (
        <Message key={m.id} comments={[]} {...m} />
      ))}

      {data?.getPosts.data?.map((m) => (
        <Message key={m.id} {...m} />
      ))}

      {data?.getPosts.data && data.getPosts.data.length >= 10 && (
        <div ref={ref}></div>
      )}
    </section>
  );
}
