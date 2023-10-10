"use client";

import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { gql } from "@tf/codegen/__generated__";
import { signOut, useSession } from "next-auth/react";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

const GET_CURRENT_USER = gql(`
query GetCurrentUser {
  getCurrentUser {
    id
    username
    createdAt
  }
}
`);

export default function Profile() {
  const { push } = useRouter();
  const { status } = useSession();
  const { data, loading } = useQuery(GET_CURRENT_USER);

  if (status === "unauthenticated") {
    push("/login");
  }

  if (loading) {
    return (
      <div className="grid place-items-center pt-40">
        <Icons.spinner className="w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="container text-sm flex justify-between items-center">
      <div>
        <h2 className="font-semibold">{data?.getCurrentUser.username}</h2>
        {data?.getCurrentUser.createdAt && (
          <p className="text-muted-foreground mt-1">
            Joined{" "}
            {formatDistanceToNow(new Date(data?.getCurrentUser.createdAt), {
              addSuffix: true,
            })}
          </p>
        )}
      </div>
      <Button type="button" onClick={() => signOut()} className="mt-4">
        Logout
      </Button>
    </div>
  );
}
