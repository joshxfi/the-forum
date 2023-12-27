import { useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { gql, useMutation } from "@apollo/client";
import { GetMessagesQuery } from "@tf/codegen/__generated__/graphql";

import { Icons } from "./icons";
import { Badge } from "./badge";
import { useToast } from "./ui/use-toast";
import { useMessageStore } from "@/store/useMessageStore";

type Props = {
  type: "message" | "reply";
  isAuthor?: boolean;
  isUserAuthor?: boolean;
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
mutation AddUpvote($type: String!, $messageId: ID!) {
  addUpvote(type: $type, messageId: $messageId) {
    id
  }
}
`);

const REMOVE_UPVOTE = gql(`
mutation RemoveUpvote($upvoteId: ID!) {
  removeUpvote(id: $upvoteId) 
}
`);

export const Post = ({
  type,
  isAuthor,
  isUserAuthor,
  replyCount,
  upvoteCount = 0,
  setShowReplies,
  ...rest
}: Props & (Reply | Message)) => {
  const [addUpvote, { loading: addUpvoteLoading }] = useMutation(ADD_UPVOTE);
  const [removeUpvote, { loading: removeUpvoteLoading }] =
    useMutation(REMOVE_UPVOTE);
  const { toast } = useToast();
  const { data: session } = useSession();

  const tempUpvote = useMessageStore((state) => state.tempUpvotes).find(
    (u) => u.messageId === rest.id
  );

  const updateTempUpvotes = useMessageStore((state) => state.updateTempUpvotes);

  const isUpvoted = useMemo(
    () => rest.upvotes?.some((u) => u.userId === session?.user?.id),
    [rest.upvotes, session?.user]
  );

  const upvoteId = useMemo(
    () =>
      tempUpvote
        ? tempUpvote.upvoteId
        : rest.upvotes?.find((u) => u.userId === session?.user?.id)?.id,
    [tempUpvote, rest.upvotes, session?.user]
  );

  const displayUpvoteCount = useCallback(() => {
    if (!!tempUpvote) {
      if (isUpvoted)
        return !tempUpvote.upvoteId ? upvoteCount - 1 : upvoteCount;
      return tempUpvote.upvoteId ? upvoteCount + 1 : upvoteCount;
    } else {
      return upvoteCount;
    }
  }, [tempUpvote, isUpvoted, upvoteCount]);

  const handleAddUpvote = (messageId: string, type: "message" | "reply") => {
    if (isUserAuthor) {
      toast({
        title: "Oops!",
        description: "You can't upvote your own post",
      });

      return;
    }
    addUpvote({
      variables: {
        messageId,
        type,
      },
      onCompleted: (data) => {
        toast({
          title: "Success",
          description: "Upvoted successfully",
        });
        updateTempUpvotes({ upvoteId: data.addUpvote.id, messageId: rest.id });
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

  const handleRemoveUpvote = () => {
    if (!upvoteId) {
      toast({
        title: "Oops!",
        description: "Something went wrong",
      });

      return;
    }

    removeUpvote({
      variables: {
        upvoteId,
      },
      onCompleted: () => {
        toast({
          title: "Success",
          description: "Upvote removed",
        });

        updateTempUpvotes({ messageId: rest.id });
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
    <div className="border-b border-muted pb-8 max-w-screen-sm mx-auto text-sm">
      <div className={`${type === "reply" && "pl-10 pt-8"}`}>
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
        </div>

        <p>{rest.content}</p>

        <div className="flex space-x-1 mt-2">
          {type === "reply" && isAuthor && <Badge>author</Badge>}
          {isUserAuthor && <Badge className="bg-gray-900">you</Badge>}
        </div>

        <div className="mt-4 flex gap-x-2 items-center">
          <div className="flex gap-x-1 items-center">
            {(!!tempUpvote && !!tempUpvote.upvoteId) ||
            (isUpvoted && !tempUpvote) ? (
              <button
                type="button"
                disabled={removeUpvoteLoading}
                onClick={handleRemoveUpvote}
              >
                <Icons.arrowUpSolid className="w-6 h-6" />
              </button>
            ) : (
              <button
                type="button"
                disabled={addUpvoteLoading}
                onClick={() => handleAddUpvote(rest.id, "message")}
              >
                <Icons.arrowUp className="w-6 h-6" />
              </button>
            )}

            <p className="text-muted-foreground">{displayUpvoteCount()}</p>
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
