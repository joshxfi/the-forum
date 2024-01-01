import { useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { gql, useMutation } from "@apollo/client";
import { GetPostsQuery } from "@tf/codegen/__generated__/graphql";

import { Icons } from "./icons";
import { Badge } from "./badge";
import { useToast } from "./ui/use-toast";
import { usePostStore } from "@/store/usePostStore";

type Props = {
  type: "post" | "comment";
  isAuthor?: boolean;
  isUserAuthor?: boolean;
  upvoteCount?: number;
  commentCount?: number;
  setShowComments?: React.Dispatch<React.SetStateAction<boolean>>;
};

type Comment = NonNullable<
  NonNullable<Required<GetPostsQuery["getPosts"]>["data"]>[0]["comments"]
>[0];
type post = NonNullable<Required<GetPostsQuery["getPosts"]["data"]>>[0];

const ADD_UPVOTE = gql(`
mutation AddUpvote($postId: ID!) {
  addUpvote(postId: $postId) {
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
  commentCount,
  upvoteCount = 0,
  setShowComments,
  ...rest
}: Props & (Comment | post)) => {
  const [addUpvote, { loading: addUpvoteLoading }] = useMutation(ADD_UPVOTE);
  const [removeUpvote, { loading: removeUpvoteLoading }] =
    useMutation(REMOVE_UPVOTE);
  const { toast } = useToast();
  const { data: session, status } = useSession();

  const tempUpvote = usePostStore((state) => state.tempUpvotes).find(
    (u) => u.postId === rest.id
  );

  const updateTempUpvotes = usePostStore((state) => state.updateTempUpvotes);

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

  const handleAddUpvote = (postId: string) => {
    if (status === "unauthenticated") {
      toast({
        title: "Oops!",
        description: "You are not logged in",
      });

      return;
    }

    if (isUserAuthor) {
      toast({
        title: "Oops!",
        description: "You can't upvote your own post",
      });

      return;
    }
    addUpvote({
      variables: {
        postId,
      },
      onCompleted: (data) => {
        toast({
          title: "Success",
          description: "Upvoted successfully",
        });
        updateTempUpvotes({ upvoteId: data.addUpvote.id, postId: rest.id });
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

        updateTempUpvotes({ postId: rest.id });
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
      <div className={`${type === "comment" && "pl-16 pt-8"} container`}>
        <div className="flex gap-x-2 mb-2">
          <h2 className="font-semibold">
            {rest.isAnonymous ? (
              <span className="text-zinc-400">hidden</span>
            ) : (
              rest.author.username
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
          {type === "comment" && isAuthor && <Badge>author</Badge>}
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
                onClick={() => handleAddUpvote(rest.id)}
              >
                <Icons.arrowUp className="w-6 h-6" />
              </button>
            )}

            <p className="text-muted-foreground">{displayUpvoteCount()}</p>
          </div>

          {setShowComments && (
            <div className="flex gap-x-1 items-center">
              <button type="button" onClick={() => setShowComments((p) => !p)}>
                <Icons.reply className="w-6 h-6" />
              </button>

              <p className="text-muted-foreground">{commentCount}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
