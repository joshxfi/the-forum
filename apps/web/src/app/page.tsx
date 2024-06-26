"use client";

import { nanoid } from "nanoid";
import { useEffect } from "react";
import { gql } from "@tf/codegen/__generated__";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";

import { Skeleton } from "@/components/ui/skeleton";
import { usePostStore } from "@/store/usePostStore";
import { PostContainer } from "@/components/post/post-container";

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
      tags {
        id
        name
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
  const tempPosts = usePostStore((state) => state.posts);
  const removedPosts = usePostStore((state) => state.removedPosts);

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
      {Object.entries(tempPosts)
        .filter(([_, m]) => !removedPosts.includes(m.id))
        .reverse()
        .map(([_, m]) => (
          <PostContainer key={m.id} comments={[]} {...m} />
        ))}

      {data?.getPosts.data
        ?.filter((m) => !removedPosts.includes(m.id))
        .map((m) => (
          <PostContainer key={m.id} {...m} />
        ))}

      {!!data?.getPosts.data && data.getPosts.data.length >= 10 && (
        <div ref={ref}></div>
      )}
    </section>
  );
}
