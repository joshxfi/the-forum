"use client";

import React, { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation } from "@apollo/client";
import { formatDistanceToNow } from "date-fns";
import { gql } from "@tf/codegen/__generated__";
import { GetMessagesQuery } from "@tf/codegen/__generated__/graphql";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Post } from "./post";
import { Badge } from "./badge";
import { Icons } from "./icons";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { useMessageStore } from "@/store/useMessageStore";

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
}: NonNullable<Required<GetMessagesQuery["getMessages"]["data"]>>[0]) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [reply, setReply] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const [sendReply, { loading }] = useMutation(WRITE_REPLY);
  const isUserAuthor = props.user.id === session?.user?.id;

  const _tempReplies = useMessageStore((state) => state.tempReplies);
  const updateTempReplies = useMessageStore((state) => state.updateTempReplies);

  const tempReplies = useMemo(
    () => _tempReplies.find((r) => r.messageId === props.id)?.replyData ?? [],
    [_tempReplies, props.id]
  );

  const handleReply: React.FormEventHandler = (e) => {
    e.preventDefault();
    sendReply({
      variables: {
        content: reply,
        isAnonymous: isUserAuthor
          ? props.isAnonymous
            ? true
            : false
          : isAnonymous,
        messageId: props.id,
      },
      onCompleted: (data) => {
        toast({
          title: "Success",
          description: "Your reply has been sent successfully",
        });
        setReply("");
        updateTempReplies({
          messageId: props.id,
          replyData: [data.writeReply],
        });
        setShowDialog(false);
      },
      onError: (err) => {
        console.log(err);

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
        isUserAuthor={isUserAuthor}
        replyCount={(props.replies?.length ?? 0) + tempReplies.length}
        upvoteCount={props.upvotes?.length}
        setShowReplies={setShowReplies}
      />

      {showReplies && (
        <div className="mt-4">
          <button
            onClick={() => setShowDialog(true)}
            type="button"
            className="rounded-full w-full px-5 py-3 bg-muted text-sm text-left text-muted-foreground"
          >
            Reply to {props.isAnonymous ? "user" : props.user.username}
          </button>

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent className="max-w-[425px]">
              <DialogHeader className="text-left text-sm">
                <div className="flex gap-x-2 mb-2">
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

                <div className="flex space-x-1 mt-2">
                  {isUserAuthor && <Badge className="bg-gray-900">you</Badge>}
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
                <div className="flex items-center justify-between h-8">
                  {isUserAuthor ? (
                    <p className="text-muted-foreground italic text-xs">
                      Username will be {props.isAnonymous ? "hidden" : "shown"}
                    </p>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={isAnonymous}
                        onClick={() => setIsAnonymous((prev) => !prev)}
                        id="hide-username"
                      />
                      <Label htmlFor="hide-username">Hide Username</Label>
                    </div>
                  )}

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
              isAuthor={props.user.id === reply.user.id}
              isUserAuthor={isUserAuthor}
            />
          ))}

          {tempReplies?.map((reply) => (
            <Post
              key={reply.id}
              type="reply"
              {...reply}
              isAuthor={props.user.id === reply.user.id}
              isUserAuthor={isUserAuthor}
            />
          ))}
        </div>
      )}
    </div>
  );
}
