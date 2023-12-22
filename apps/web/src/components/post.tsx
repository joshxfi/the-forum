import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { gql, useMutation } from "@apollo/client";
import { GetMessagesQuery } from "@tf/codegen/__generated__/graphql";

import { Icons } from "./icons";
import { useToast } from "./ui/use-toast";
import { useMessageStore } from "@/store/useMessageStore";

type Props = {
  type: "message" | "reply";
  isAuthor?: boolean;
  upvoteCount?: number;
  replyCount?: number;
  setShowReplies?: React.Dispatch<React.SetStateAction<boolean>>;
};

type Reply = NonNullable<
  NonNullable<Required<GetMessagesQuery["getMessages"]>["data"]>[0]["replies"]
>[0];
type Message = NonNullable<
  Required<GetMessagesQuery["getMessages"]["data"]>
>[0];

const ADD_UPVOTE = gql(`
mutation AddUpvote($type: String!, $messageId: String!) {
  addUpvote(type: $type, messageId: $messageId) {
    id
  }
}
`);

export const Post = ({
  type,
  isAuthor,
  replyCount,
  upvoteCount = 0,
  setShowReplies,
  ...rest
}: Props & (Reply | Message)) => {
  const [addUpvote, { loading }] = useMutation(ADD_UPVOTE);
  const { toast } = useToast();
  const { data: session } = useSession();

  const isTempUpvote = useMessageStore((state) => state.tempUpvotes).includes(
    rest.id
  );
  const updateTempUpvotes = useMessageStore((state) => state.updateTempUpvotes);
  const upvotes = useMemo(
    () => (isTempUpvote ? upvoteCount + 1 : upvoteCount),
    [isTempUpvote, upvoteCount]
  );

  const handleUpvote = (messageId: string, type: "message" | "reply") => {
    addUpvote({
      variables: {
        messageId,
        type,
      },
      onCompleted: () => {
        toast({
          title: "Success",
          description: "Upvoted successfully",
        });
        updateTempUpvotes(rest.id);
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
    <div className="border-b border-muted pb-8 max-w-screen-sm mx-auto text-sm">
      <div className={`${type === "reply" && "pl-10 pt-8"} container`}>
        <div className="flex gap-x-2 mb-2">
          <h2 className="font-semibold">
            {rest.isAnonymous ? (
              <span className="text-zinc-400">hidden</span>
            ) : (
              rest.user.username
            )}
          </h2>
          <p className="text-muted-foreground">
            {formatDistanceToNow(new Date(rest.createdAt), {
              addSuffix: true,
            })}
          </p>
          {type === "reply" && isAuthor && (
            <p className="py-[2px] px-2 text-secondary-foreground text-xs bg-secondary border border-muted-foreground rounded-full">
              author
            </p>
          )}
        </div>

        <p>{rest.content}</p>

        <div className="mt-2 flex gap-x-2 items-center">
          <div className="flex gap-x-1 items-center">
            {isTempUpvote ||
            rest.upvotes?.some((u) => u.userId === session?.user?.id) ? (
              <button type="button">
                <Icons.arrowUpSolid className="w-6 h-6" />
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={() => handleUpvote(rest.id, "message")}
              >
                <Icons.arrowUp className="w-6 h-6" />
              </button>
            )}

            <p className="text-muted-foreground">{upvotes}</p>
          </div>

          {setShowReplies && (
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
