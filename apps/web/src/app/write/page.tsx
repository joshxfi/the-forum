"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation } from "@apollo/client";
import { gql } from "@tf/codegen/__generated__";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";

import { Icons } from "@/components/icons";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const WRITE_MESSAGE = gql(`
mutation WriteMessage($isAnonymous: Boolean!, $content: String!) {
  writeMessage(isAnonymous: $isAnonymous, content: $content) {
    content
    user {
      id
      username
    }
  }
}
`);

const GET_CURRENT_USER = gql(`
query GetCurrentUser {
  getCurrentUser {
    id
    username
    createdAt
  }
}
`);

export default function Write() {
  const { data, loading } = useQuery(GET_CURRENT_USER);
  const [submitMessage, { loading: submitLoading }] =
    useMutation(WRITE_MESSAGE);

  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const { toast } = useToast();
  const { status } = useSession();
  const { push } = useRouter();

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();

    submitMessage({
      variables: { content, isAnonymous },
      onCompleted: () => {
        setContent("");
        setIsAnonymous(false);
        toast({
          title: "Message sent!",
          description: "Your message has been posted.",
        });
        push("/");
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
        });
      },
    });
  };

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
    <form onSubmit={handleSubmit} className="container">
      <div className="flex flex-col gap-y-3">
        <div className="flex items-end justify-between h-8">
          <h2
            className={`${
              isAnonymous && "text-muted-foreground"
            } font-semibold text-sm`}
          >
            {data?.getCurrentUser.username}
          </h2>
          {submitLoading && <Icons.spinner className="w-8 h-8" />}
        </div>

        <Textarea
          required
          maxLength={500}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="type your message here."
          className="max-h-[300px]"
        />

        <Button
          type="submit"
          disabled={submitLoading || content.length === 0}
          className="w-full"
        >
          Post
        </Button>

        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <Switch
              checked={isAnonymous}
              onClick={() => setIsAnonymous((prev) => !prev)}
              id="hide-username"
            />
            <Label htmlFor="hide-username">Hide Username</Label>
          </div>

          <p className="text-muted-foreground text-sm mb-2 text-right">
            {content.length}/500
          </p>
        </div>
      </div>
    </form>
  );
}
