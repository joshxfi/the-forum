"use client";

import React, { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation } from "@apollo/client";
import { formatDistanceToNow } from "date-fns";
import { gql } from "@tf/codegen/__generated__";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { PostData } from "@/types";
import { Button } from "@/components/ui/button";

import { Post } from "./post";
import { Badge } from "./badge";
import { Icons } from "./icons";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { usePostStore } from "@/store/usePostStore";

const ADD_COMMENT = gql(`
mutation AddComment($postId: ID!, $isAnonymous: Boolean!, $content: String!) {
  addComment(postId: $postId, isAnonymous: $isAnonymous, content: $content) {
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

export function PostContainer({ ...props }: PostData) {
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const [addComment, { loading }] = useMutation(ADD_COMMENT);
  const isUserAuthor = props.author.id === session?.user?.id;

  const _tempComments = usePostStore((state) => state.tempComments);
  const updateTempComments = usePostStore((state) => state.updateTempComments);

  const tempComments = useMemo(
    () => _tempComments.find((r) => r.postId === props.id)?.commentData ?? [],
    [_tempComments, props.id]
  );

  const handleComment: React.FormEventHandler = (e) => {
    e.preventDefault();

    addComment({
      variables: {
        content: comment,
        isAnonymous: isUserAuthor
          ? props.isAnonymous
            ? true
            : false
          : isAnonymous,
        postId: props.id,
      },
      onCompleted: (data) => {
        toast({
          title: "Success",
          description: "Your comment has been added",
        });
        setComment("");
        updateTempComments({
          postId: props.id,
          commentData: [data?.addComment],
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
        type="post"
        isUserAuthor={isUserAuthor}
        commentCount={(props.comments?.length ?? 0) + tempComments.length}
        upvoteCount={props.upvotes?.length}
        setShowComments={setShowComments}
      />

      {showComments && (
        <div className="mt-4">
          <div className="container">
            <button
              onClick={() => {
                if (status === "unauthenticated") {
                  toast({
                    title: "Oops!",
                    description: "You are not logged in",
                  });

                  return;
                }

                setShowDialog(true);
              }}
              type="button"
              className="rounded-full w-full px-5 py-3 bg-muted text-sm text-left text-muted-foreground"
            >
              Add a comment to {props.isAnonymous ? "user" : props.author.username}
            </button>
          </div>

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent className="max-w-[425px]">
              <DialogHeader className="text-left text-sm">
                <div className="flex gap-x-2 mb-2">
                  <h2 className="font-semibold">
                    {props.isAnonymous ? (
                      <span className="text-zinc-400">hidden</span>
                    ) : (
                      props.author.username
                    )}
                  </h2>
                  <p className="text-muted-foreground">
                    {formatDistanceToNow(new Date(props.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>

                <p>{props.content}</p>

                <div className="flex pt-1">
                  {isUserAuthor && <Badge className="bg-gray-900">you</Badge>}
                </div>
              </DialogHeader>

              <form onSubmit={handleComment}>
                <Textarea
                  required
                  maxLength={500}
                  value={comment}
                  disabled={loading}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Type your comment here"
                  className="max-h-[300px]"
                />

                <Button
                  type="submit"
                  disabled={loading || comment.length === 0}
                  className="w-full mt-4"
                >
                  Comment
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

          {props.comments?.map((comment) => (
            <Post
              key={comment.id}
              type="comment"
              {...comment}
              upvoteCount={comment.upvotes?.length}
              isAuthor={props.author.id === comment.author.id}
              isUserAuthor={isUserAuthor}
            />
          ))}

          {tempComments?.map((comment) => (
            <Post
              key={comment.id}
              type="comment"
              {...comment}
              isAuthor={props.author.id === comment.author.id}
              isUserAuthor={isUserAuthor}
            />
          ))}
        </div>
      )}
    </div>
  );
}
