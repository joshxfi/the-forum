"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { gql } from "@tf/codegen/__generated__";
import { useMutation, useQuery } from "@apollo/client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const WRITE_MESSAGE = gql(`
mutation WriteMessage($input: WriteMessageInput!) {
  writeMessage(input: $input) {
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
  }
}
`);

export default function Write() {
  const { data } = useQuery(GET_CURRENT_USER);
  const [submitMessage] = useMutation(WRITE_MESSAGE);

  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const { toast } = useToast();
  const { status } = useSession();
  const { push } = useRouter();

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();

    submitMessage({
      variables: { input: { content, isAnonymous } },
      onCompleted: () => {
        setContent("");
        setIsAnonymous(false);
        toast({
          title: "Message sent!",
          description: "Your message has been sent.",
        });
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

  return (
    <form onSubmit={handleSubmit} className="container">
      <div className="flex flex-col gap-y-3">
        <h2
          className={`${
            isAnonymous && "text-muted-foreground"
          } font-semibold text-sm`}
        >
          {data?.getCurrentUser.username}
        </h2>

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
          disabled={content.length === 0}
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
