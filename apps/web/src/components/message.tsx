"use client";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { gql } from "@tf/codegen/__generated__";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icons } from "./icons";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { GetMessagesQuery } from "@tf/codegen/__generated__/graphql";
import { ReplyPost } from "./reply-post";

const WRITE_REPLY = gql(`
mutation WriteReply($input: WriteReplyInput!) {
  writeReply(input: $input) {
    id
    content
    createdAt
    isAnonymous
    user {
      username
    }
  }
}
`);

export function Message({ ...props }: GetMessagesQuery["getMessages"][0]) {
  const { toast } = useToast();
  const [reply, setReply] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [sendReply] = useMutation(WRITE_REPLY);

  const handleReply: React.FormEventHandler = (e) => {
    e.preventDefault();

    sendReply({
      variables: {
        input: {
          content: reply,
          isAnonymous,
          messageId: props.id,
        },
      },
      onCompleted: () => {
        toast({
          title: "Success",
          description: "Your reply has been sent successfully",
        });
        setReply("");
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Something went wrong",
        });
      },
    });
  };

  return (
    <div className="pb-8">
      <Post {...props} setShowReplies={setShowReplies} />

      {showReplies && (
        <div className="mt-4 container">
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="rounded-full w-full px-5 py-3 bg-muted text-sm text-left text-muted-foreground"
              >
                Reply to {props.user.username}
              </button>
            </DialogTrigger>

            <DialogContent className="max-w-[425px]">
              <DialogHeader className="text-left text-sm">
                <div className="flex gap-x-2">
                  <h2 className="font-semibold">{props.user.username}</h2>
                  <p className="text-muted-foreground">
                    {formatDistanceToNow(new Date(props.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>

                <p>{props.content}</p>

                <div className="mt-2 flex gap-x-2 items-center">
                  <div className="flex gap-x-1 items-center">
                    <Icons.arrowUp className="w-6 h-6" />

                    <p className="text-muted-foreground">12</p>
                  </div>

                  <div className="flex gap-x-1 items-center">
                    <Icons.reply className="w-6 h-6" />

                    <p className="text-muted-foreground">3</p>
                  </div>
                </div>
              </DialogHeader>

              <form onSubmit={handleReply}>
                <Textarea
                  required
                  maxLength={500}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply here"
                  className="max-h-[300px]"
                />

                <Button type="submit" className="w-full mt-4">
                  Reply
                </Button>
              </form>

              <DialogFooter>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={isAnonymous}
                    onClick={() => setIsAnonymous((prev) => !prev)}
                    id="hide-username"
                  />
                  <Label htmlFor="hide-username">Hide Username</Label>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {props.replies?.map((reply) => (
            <ReplyPost {...reply} upvoteCount={2} />
          ))}
        </div>
      )}
    </div>
  );
}

type Props = {
  upvoteCount?: number;
  replyCount?: number;
  setShowReplies: React.Dispatch<React.SetStateAction<boolean>>;
};

const Post = ({
  upvoteCount,
  replyCount,
  setShowReplies,
  ...rest
}: Props & GetMessagesQuery["getMessages"][0]) => {
  return (
    <div className="border-b border-muted pb-8 max-w-screen-sm mx-auto">
      <div className="text-sm container">
        <div className="flex gap-x-2 mb-2">
          <h2 className="font-semibold">{rest.user.username}</h2>
          <p className="text-muted-foreground">
            {formatDistanceToNow(new Date(rest.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>

        <p>{rest.content}</p>

        <div className="mt-2 flex gap-x-2 items-center">
          <div className="flex gap-x-1 items-center">
            <button>
              <Icons.arrowUp className="w-6 h-6" />
            </button>

            <p className="text-muted-foreground">{upvoteCount}</p>
          </div>

          <div className="flex gap-x-1 items-center">
            <button type="button" onClick={() => setShowReplies((p) => !p)}>
              <Icons.reply className="w-6 h-6" />
            </button>

            <p className="text-muted-foreground">{replyCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
