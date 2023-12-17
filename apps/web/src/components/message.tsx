"use client";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { gql } from "@tf/codegen/__generated__";
import {
  GetMessagesQuery,
  WriteReplyMutation,
} from "@tf/codegen/__generated__/graphql";

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
import { Post } from "./post";

const WRITE_REPLY = gql(`
mutation WriteReply(
  $messageId: ID!
  $isAnonymous: Boolean!
  $content: String!
) {
  writeReply(
    messageId: $messageId
    isAnonymous: $isAnonymous
    content: $content
  ) {
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

export function Message({
  ...props
}: GetMessagesQuery["getMessages"]["data"][0]) {
  const { toast } = useToast();
  const [reply, setReply] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [tempReplies, setTempReplies] = useState<
    WriteReplyMutation["writeReply"][]
  >([]);

  const [sendReply, { loading }] = useMutation(WRITE_REPLY);

  const handleReply: React.FormEventHandler = (e) => {
    e.preventDefault();
    sendReply({
      variables: {
        content: reply,
        isAnonymous,
        messageId: props.id,
      },
      onCompleted: (data) => {
        toast({
          title: "Success",
          description: "Your reply has been sent successfully",
        });
        setReply("");
        setTempReplies((prev) => [data.writeReply, ...prev]);
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
      <Post
        {...props}
        type="message"
        replyCount={props.replies?.length}
        upvoteCount={props.upvotes?.length}
        setShowReplies={setShowReplies}
      />

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
                  <h2 className="font-semibold">
                    {props.isAnonymous ? (
                      <span className="text-zinc-400">hidden</span>
                    ) : (
                      props.user.username
                    )}
                  </h2>
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

                    <p className="text-muted-foreground">
                      {props.upvotes?.length}
                    </p>
                  </div>

                  <div className="flex gap-x-1 items-center">
                    <Icons.reply className="w-6 h-6" />

                    <p className="text-muted-foreground">
                      {props.replies?.length}
                    </p>
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

                <Button
                  type="submit"
                  disabled={loading || reply.length === 0}
                  className="w-full mt-4"
                >
                  Reply
                </Button>
              </form>

              <DialogFooter>
                <div className="flex justify-between h-8">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={isAnonymous}
                      onClick={() => setIsAnonymous((prev) => !prev)}
                      id="hide-username"
                    />
                    <Label htmlFor="hide-username">Hide Username</Label>
                  </div>
                  {loading && <Icons.spinner className="w-8 h-8" />}
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {props.replies?.map((reply) => (
            <Post
              key={reply.id}
              type="reply"
              {...reply}
              upvoteCount={reply.upvotes?.length}
            />
          ))}

          {tempReplies.map((reply) => (
            <Post key={reply.id} type="reply" {...reply} upvoteCount={0} />
          ))}
        </div>
      )}
    </div>
  );
}
