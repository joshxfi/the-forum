"use client";
import React, { useState } from "react";
import { Icons } from "./icons";

type Props = {
  username: string;
  content: string;
  timestamp: string;
  upvoteCount: number;
  replyCount: number;
};

export function Message({ ...rest }: Props) {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="pb-8">
      <Post {...rest} type="origin" setShowReplies={setShowReplies} />

      {showReplies && (
        <div>
          <Post
            username="jane04"
            content="that's amazing! 🚀"
            timestamp="2023-08-11"
            upvoteCount={2}
            replyCount={0}
            type="reply"
          />

          <Post
            username="user_091"
            content="I'm so proud of you!"
            timestamp="2023-08-11"
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
      <div
        className={`text-sm container ${
          type === "reply" && "pl-16 pt-8"
        }`}
      >
        <div className="flex gap-x-2 mb-2">
          <h2 className="font-semibold">{username}</h2>
          <p className="text-muted-foreground">{timestamp}</p>
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
