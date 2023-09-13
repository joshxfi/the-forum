"use client";
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Icons } from "./icons";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

type Props = {
  username: string;
  content: string;
  timestamp: Date;
  upvoteCount: number;
  replyCount: number;
};

export function Message({ ...props }: Props) {
  const [reply, setReply] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  return (
    <div className="pb-8">
      <Post
        {...props}
        type="origin"
        username={props.username}
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
                Reply to {props.username}
              </button>
            </DialogTrigger>

            <DialogContent className="max-w-[425px]">
              <DialogHeader className="text-left text-sm">
                <div className="flex gap-x-2">
                  <h2 className="font-semibold">{props.username}</h2>
                  <p className="text-muted-foreground">
                    {formatDistanceToNow(new Date(props.timestamp), {
                      addSuffix: true,
                    })}
                  </p>
                </div>

                <p>{props.content}</p>

                <div className="mt-2 flex gap-x-2 items-center">
                  <div className="flex gap-x-1 items-center">
                    <Icons.arrowUp className="w-6 h-6" />

                    <p className="text-muted-foreground">{props.upvoteCount}</p>
                  </div>

                  <div className="flex gap-x-1 items-center">
                    <Icons.reply className="w-6 h-6" />

                    <p className="text-muted-foreground">{props.replyCount}</p>
                  </div>
                </div>
              </DialogHeader>

              <Textarea
                required
                maxLength={500}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply here"
                className="max-h-[300px]"
              />

              <Button type="submit">Reply</Button>
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

          <Post
            username="jane04"
            content="that's amazing! 🚀"
            timestamp={new Date()}
            upvoteCount={2}
            replyCount={0}
            type="reply"
          />

          <Post
            username="user_091"
            content="I'm so proud of you!"
            timestamp={new Date()}
            upvoteCount={4}
            replyCount={0}
            type="reply"
          />
        </div>
      )}
    </div>
  );
}

const Post = ({
  username,
  content,
  timestamp,
  upvoteCount,
  replyCount,
  type = "origin",
  setShowReplies,
}: Props & {
  type: "origin" | "reply";
  setShowReplies?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="border-b border-muted pb-8 max-w-screen-sm mx-auto">
      <div className={`text-sm container ${type === "reply" && "pl-12 pt-8"}`}>
        <div className="flex gap-x-2 mb-2">
          <h2 className="font-semibold">{username}</h2>
          <p className="text-muted-foreground">
            {formatDistanceToNow(new Date(timestamp), {
              addSuffix: true,
            })}
          </p>
        </div>

        <p>{content}</p>

        <div className="mt-2 flex gap-x-2 items-center">
          <div className="flex gap-x-1 items-center">
            <button>
              <Icons.arrowUp className="w-6 h-6" />
            </button>

            <p className="text-muted-foreground">{upvoteCount}</p>
          </div>

          {setShowReplies && type === "origin" && (
            <div className="flex gap-x-1 items-center">
              <button type="button" onClick={() => setShowReplies((p) => !p)}>
                <Icons.reply className="w-6 h-6" />
              </button>

              <p className="text-muted-foreground">{replyCount}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
