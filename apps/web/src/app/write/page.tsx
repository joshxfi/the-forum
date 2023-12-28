"use client";

import { nanoid } from "nanoid";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation } from "@apollo/client";
import { gql } from "@tf/codegen/__generated__";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";

import { Badge } from "@/components/badge";
import { Icons } from "@/components/icons";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useMessageStore } from "@/store/useMessageStore";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { DisplayBadge } from "@/components/display-badge";

const ADD_MESSAGE = gql(`
mutation AddPost($isAnonymous: Boolean!, $content: String!) {
  addPost(isAnonymous: $isAnonymous, content: $content) {
    id
    content
    createdAt
    isAnonymous
    author {
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
    useMutation(ADD_MESSAGE);

  const [badge, setBadge] = useState("");
  const [content, setContent] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const updateTempMessages = useMessageStore(
    (state) => state.updateTempMessages
  );

  const { toast } = useToast();
  const { status } = useSession();
  const { push } = useRouter();

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();

    submitMessage({
      variables: { content, isAnonymous },
      onCompleted: (data) => {
        setContent("");
        setIsAnonymous(false);
        toast({
          title: "Message sent!",
          description: "Your message has been posted.",
        });
        updateTempMessages(data.addPost);
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
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-y-3">
        <div className="flex items-end justify-between text-sm">
          <div className="flex space-x-2">
            <h2
              className={`${
                isAnonymous && "text-muted-foreground"
              } font-semibold`}
            >
              {isAnonymous ? "hidden" : data?.getCurrentUser.username}
            </h2>

            <div className="flex space-x-1">
              <Badge className="bg-gray-900">you</Badge>
              {badge && <DisplayBadge name={badge} />}
            </div>
          </div>
          <p className="text-muted-foreground">{content.length}/500</p>
        </div>

        <div className="relative">
          <Textarea
            required
            maxLength={500}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="type your message here."
            className="max-h-[300px]"
          />
          {submitLoading && (
            <Icons.spinner className="w-8 h-8 top-2 right-2 absolute" />
          )}
        </div>

        <div className="flex items-center justify-between border-b border-muted pt-3 pb-6">
          <Label
            htmlFor="hide-username"
            className="font-normal text-muted-foreground flex space-x-2 items-center"
          >
            <Icons.hide className="w-5 h-5" />
            <p>Hide username</p>
          </Label>

          <Switch
            checked={isAnonymous}
            onClick={() => setIsAnonymous((prev) => !prev)}
            id="hide-username"
          />
        </div>

        <div className="space-x-2 self-end mt-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowDialog(true)}
          >
            Add tag
          </Button>

          <Button
            type="submit"
            disabled={submitLoading || content.length === 0}
          >
            Post
          </Button>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-[425px]">
          <DialogHeader className="text-left text-sm font-semibold">
            <p>Select a tag</p>
          </DialogHeader>

          <div className="flex flex-wrap gap-2">
            {["story", "insight", "rant", "confession", "question", "none"].map(
              (name) => (
                <button
                  key={nanoid()}
                  type="button"
                  onClick={() => {
                    setBadge(name === "none" ? "" : name);
                    setShowDialog(false);
                  }}
                >
                  <DisplayBadge name={name} />
                </button>
              )
            )}
          </div>

          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}
